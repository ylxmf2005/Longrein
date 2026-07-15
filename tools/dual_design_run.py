#!/usr/bin/env python3
"""Canonical DualDesignRun parsing, validation, and atomic publication."""

from __future__ import annotations

import hashlib
import json
import os
import re
import tempfile
from pathlib import Path

SCHEMA_VERSION = "1"
CANONICALIZATION_VERSION = "dual-design-run-c14n-v1"
GENERATION_RE = re.compile(r"^generation-(\d{6})\.md$")
KV_RE = re.compile(r"^([A-Za-z_][\w-]*):\s*(.*)$")
POST_ACTIVATION_STATES = {
    "active", "ready", "synthesizing", "sponsor_blocked", "blocked",
    "completed", "stale",
}
ALLOWED_TRANSITIONS = {
    None: {"active"},
    "active": {"active", "ready", "blocked", "stale"},
    "blocked": {"active", "blocked", "stale"},
    "ready": {"synthesizing", "blocked", "stale"},
    "synthesizing": {"sponsor_blocked", "completed", "blocked", "stale"},
    "sponsor_blocked": {"synthesizing", "blocked", "stale"},
    "completed": set(),
    "stale": set(),
}
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
REQUIRED = {
    "artifact_type", "task_id", "author_agent", "status", "schema_version",
    "canonicalization_version", "run_id", "dual_marker", "generation",
    "previous_generation_sha256", "generation_sha256", "state",
    "input_sha256", "evidence_sha256", "frozen_input_handle",
    "bold_current_attempt", "minimal_current_attempt",
    "barrier_generation", "barrier_sha256", "attempts_json", "events_json",
}


class ValidationError(ValueError):
    pass


def parse_frontmatter(path: Path) -> dict[str, str]:
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        raise ValidationError(f"{path}: missing frontmatter")
    values: dict[str, str] = {}
    for line in lines[1:]:
        if line.strip() == "---":
            return values
        if not line.strip() or line[:1].isspace() or line.startswith("-"):
            continue
        match = KV_RE.match(line)
        if match:
            value = match.group(2).strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            values[match.group(1)] = value
    raise ValidationError(f"{path}: unclosed frontmatter")


def canonical_bytes(fields: dict[str, str]) -> bytes:
    if fields.get("canonicalization_version") != CANONICALIZATION_VERSION:
        raise ValidationError("unsupported canonicalization_version")
    canonical = {key: value for key, value in fields.items() if key != "generation_sha256"}
    return (json.dumps(canonical, ensure_ascii=False, sort_keys=True,
                       separators=(",", ":")) + "\n").encode("utf-8")


def canonical_sha256(fields: dict[str, str]) -> str:
    return hashlib.sha256(canonical_bytes(fields)).hexdigest()


def _json_list(fields: dict[str, str], key: str, path: Path) -> list[object]:
    try:
        value = json.loads(fields[key])
    except (KeyError, json.JSONDecodeError) as exc:
        raise ValidationError(f"{path}: invalid {key}: {exc}") from exc
    if not isinstance(value, list):
        raise ValidationError(f"{path}: {key} must be a JSON list")
    return value


def task_run_pointer(task_record: Path | None) -> str | None:
    if task_record is None:
        raise ValidationError("TaskRecord is required to prove legacy single-lane state")
    if not task_record.is_file():
        raise ValidationError(f"TaskRecord is missing or unreadable: {task_record}")
    fields = parse_frontmatter(task_record)
    value = fields.get("dual_design_run_path", "").strip()
    return value or None


def _safe_artifact(task_root: Path, relative: str, expected_sha256: str, label: str) -> Path:
    if not SHA256_RE.fullmatch(expected_sha256):
        raise ValidationError(f"{label} sha256 is invalid")
    root = task_root.resolve()
    path = (root / relative).resolve()
    try:
        path.relative_to(root)
    except ValueError as exc:
        raise ValidationError(f"{label} escapes task root: {relative}") from exc
    if not path.is_file():
        raise ValidationError(f"{label} is missing: {path}")
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    if actual != expected_sha256:
        raise ValidationError(f"{label} hash mismatch")
    return path


def _attempts_by_id(attempts: list[object], path: Path, input_sha256: str) -> dict[str, dict[str, object]]:
    indexed: dict[str, dict[str, object]] = {}
    for raw in attempts:
        if not isinstance(raw, dict):
            raise ValidationError(f"{path}: every attempt must be an object")
        required = {"lane", "attempt_id", "actor_id", "state", "input_sha256"}
        if required - raw.keys():
            raise ValidationError(f"{path}: attempt is missing identity/state fields")
        if raw["lane"] not in {"bold", "minimal"} or raw["state"] not in {
            "running", "completed", "blocked", "stale", "cancelled"
        }:
            raise ValidationError(f"{path}: invalid attempt lane/state")
        if raw["input_sha256"] != input_sha256:
            raise ValidationError(f"{path}: attempt input differs from frozen input")
        attempt_id = str(raw["attempt_id"])
        if attempt_id in indexed:
            raise ValidationError(f"{path}: duplicate attempt_id {attempt_id}")
        indexed[attempt_id] = raw
    return indexed


def barrier_sha256(fields: dict[str, str], attempts: list[object]) -> str:
    payload = {
        "barrier_generation": fields["barrier_generation"],
        "input_sha256": fields["input_sha256"],
        "evidence_sha256": fields["evidence_sha256"],
        "bold_current_attempt": fields["bold_current_attempt"],
        "minimal_current_attempt": fields["minimal_current_attempt"],
        "attempts_sha256": hashlib.sha256(json.dumps(
            attempts, ensure_ascii=False, sort_keys=True, separators=(",", ":")
        ).encode("utf-8")).hexdigest(),
    }
    return hashlib.sha256(json.dumps(
        payload, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")).hexdigest()


def validate_chain(run_dir: Path, task_record: Path | None = None,
                   task_root: Path | None = None) -> list[str]:
    if not run_dir.is_dir():
        pointer = task_run_pointer(task_record)
        if pointer:
            raise ValidationError(
                f"dual marker/pointer exists but run directory is missing: {run_dir}"
            )
        return ["legacy single-lane: no dual marker or run pointer"]

    files = sorted(p for p in run_dir.iterdir() if GENERATION_RE.match(p.name))
    if not files:
        raise ValidationError(f"{run_dir}: dual run directory has no generations")

    previous_hash = "none"
    previous_attempts: list[object] = []
    previous_events: list[object] = []
    run_id: str | None = None
    stable_identity: dict[str, str] | None = None
    previous_state: str | None = None
    bound_barrier: tuple[str, str] | None = None
    messages: list[str] = []

    for expected, path in enumerate(files):
        match = GENERATION_RE.match(path.name)
        assert match
        if int(match.group(1)) != expected:
            raise ValidationError(f"{path}: generation filename gap, expected {expected:06d}")
        fields = parse_frontmatter(path)
        missing = sorted(REQUIRED - fields.keys())
        if missing:
            raise ValidationError(f"{path}: missing fields: {', '.join(missing)}")
        if fields["artifact_type"] != "DualDesignRun" or fields["author_agent"] != "delivery-orchestrator":
            raise ValidationError(f"{path}: invalid artifact/author authority")
        if fields["schema_version"] != SCHEMA_VERSION:
            raise ValidationError(f"{path}: unsupported schema_version {fields['schema_version']}")
        if fields["dual_marker"] != "true":
            raise ValidationError(f"{path}: dual_marker must be true")
        if fields["state"] not in POST_ACTIVATION_STATES:
            raise ValidationError(f"{path}: pre-activation state is forbidden in DualDesignRun")
        if int(fields["generation"]) != expected:
            raise ValidationError(f"{path}: generation field does not match filename")
        if fields["previous_generation_sha256"] != previous_hash:
            raise ValidationError(f"{path}: predecessor hash mismatch")
        own_hash = canonical_sha256(fields)
        if fields["generation_sha256"] != own_hash:
            raise ValidationError(f"{path}: canonical generation hash mismatch")
        if run_id is None:
            run_id = fields["run_id"]
        elif fields["run_id"] != run_id:
            raise ValidationError(f"{path}: run_id changed inside chain")

        identity = {key: fields[key] for key in (
            "task_id", "run_id", "input_sha256", "evidence_sha256", "frozen_input_handle"
        )}
        if not SHA256_RE.fullmatch(fields["input_sha256"]) or not SHA256_RE.fullmatch(fields["evidence_sha256"]):
            raise ValidationError(f"{path}: frozen input/evidence sha256 is invalid")
        if stable_identity is None:
            stable_identity = identity
        elif identity != stable_identity:
            raise ValidationError(f"{path}: frozen task/input/evidence identity changed inside chain")

        state = fields["state"]
        if state not in ALLOWED_TRANSITIONS[previous_state]:
            raise ValidationError(f"{path}: illegal state transition {previous_state or '[start]'} -> {state}")

        attempts = _json_list(fields, "attempts_json", path)
        events = _json_list(fields, "events_json", path)
        attempts_by_id = _attempts_by_id(attempts, path, fields["input_sha256"])
        if attempts[:len(previous_attempts)] != previous_attempts:
            raise ValidationError(f"{path}: attempt history was deleted or rewritten")
        if events[:len(previous_events)] != previous_events:
            raise ValidationError(f"{path}: event history was deleted or rewritten")

        current = {"bold": fields["bold_current_attempt"], "minimal": fields["minimal_current_attempt"]}
        for lane, attempt_id in current.items():
            if attempt_id == "none":
                continue
            attempt = attempts_by_id.get(attempt_id)
            if not attempt or attempt["lane"] != lane:
                raise ValidationError(f"{path}: {lane}_current_attempt is not a matching attempt")
        if state in {"ready", "synthesizing", "sponsor_blocked", "completed"}:
            for lane, attempt_id in current.items():
                attempt = attempts_by_id.get(attempt_id)
                if not attempt or attempt["lane"] != lane or attempt["state"] != "completed":
                    raise ValidationError(f"{path}: {state} requires completed current {lane} attempt")
                for key in ("proposal_path", "proposal_sha256", "receipt_path", "receipt_sha256"):
                    if not attempt.get(key):
                        raise ValidationError(f"{path}: completed {lane} attempt missing {key}")
                if task_root is None:
                    raise ValidationError(f"{path}: barrier validation requires --task-root")
                _safe_artifact(task_root, str(attempt["proposal_path"]),
                               str(attempt["proposal_sha256"]), f"{lane} proposal")
                _safe_artifact(task_root, str(attempt["receipt_path"]),
                               str(attempt["receipt_sha256"]), f"{lane} receipt")
            if fields["barrier_generation"] == "none" or not SHA256_RE.fullmatch(fields["barrier_sha256"]):
                raise ValidationError(f"{path}: {state} requires a bound barrier")
            if state == "ready":
                if fields["barrier_generation"] != str(expected):
                    raise ValidationError(f"{path}: ready barrier_generation must equal its generation")
                if fields["barrier_sha256"] != barrier_sha256(fields, attempts):
                    raise ValidationError(f"{path}: ready barrier hash does not bind current attempts")
                bound_barrier = (fields["barrier_generation"], fields["barrier_sha256"])
            elif bound_barrier != (fields["barrier_generation"], fields["barrier_sha256"]):
                raise ValidationError(f"{path}: barrier identity changed after ready")
        elif fields["barrier_generation"] != "none" or fields["barrier_sha256"] != "none":
            raise ValidationError(f"{path}: pre-barrier state carries barrier authority")

        if state == "completed":
            for key in ("final_path", "final_sha256", "commit_operation_id",
                        "commit_receipt_path", "commit_receipt_sha256", "commit_state"):
                if not fields.get(key):
                    raise ValidationError(f"{path}: completed generation missing {key}")
            if fields["commit_state"] != "committed":
                raise ValidationError(f"{path}: completed generation is not committed")
            if task_root is None:
                raise ValidationError(f"{path}: completed validation requires --task-root")
            _safe_artifact(task_root, fields["final_path"], fields["final_sha256"], "final artifact")
            _safe_artifact(task_root, fields["commit_receipt_path"], fields["commit_receipt_sha256"], "commit receipt")

        previous_hash = own_hash
        previous_state = state
        previous_attempts, previous_events = attempts, events
        messages.append(f"generation {expected}: {fields['state']} OK")
    return messages


def atomic_publish_generation(run_dir: Path, filename: str, content: bytes) -> Path:
    """Publish complete bytes with put-if-absent semantics.

    Bytes are written and fsynced under .staging, then atomically linked into the
    canonical namespace. A crash before link can leave only an ignorable staging file.
    """
    if not GENERATION_RE.match(filename):
        raise ValueError("invalid canonical generation filename")
    run_dir.mkdir(parents=True, exist_ok=True)
    staging = run_dir / ".staging"
    staging.mkdir(exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix=f".{filename}.", dir=staging)
    temp_path = Path(temporary)
    target = run_dir / filename
    try:
        with os.fdopen(fd, "wb") as stream:
            stream.write(content)
            stream.flush()
            os.fsync(stream.fileno())
        os.link(temp_path, target)
        directory_fd = os.open(run_dir, os.O_RDONLY)
        try:
            os.fsync(directory_fd)
        finally:
            os.close(directory_fd)
        return target
    finally:
        try:
            temp_path.unlink()
        except FileNotFoundError:
            pass
