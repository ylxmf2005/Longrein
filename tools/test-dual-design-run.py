#!/usr/bin/env python3
"""Focused regression tests for DualDesignRun authority and crash safety."""

from __future__ import annotations

import json
import hashlib
import subprocess
import sys
import tempfile
from pathlib import Path

from dual_design_run import atomic_publish_generation, barrier_sha256, canonical_sha256

ROOT = Path(__file__).resolve().parents[1]
ENTRYPOINTS = [
    ROOT / "tools/validate-dual-design-run.py",
    ROOT / "agentcorp/delivery-orchestrator/scripts/validate-dual-design-run.py",
    ROOT / "agentcorp-zh/delivery-orchestrator/scripts/validate-dual-design-run.py",
]


INPUT_SHA = "a" * 64
EVIDENCE_SHA = "e" * 64


def attempt(lane: str, state: str, proposal_sha256: str = "", receipt_sha256: str = "") -> dict[str, str]:
    value = {"lane": lane, "attempt_id": f"{lane}-1", "actor_id": f"actor-{lane}",
             "state": state, "input_sha256": INPUT_SHA}
    if state == "completed":
        value.update({"proposal_path": f"design/proposals/{lane}.md",
                      "proposal_sha256": proposal_sha256,
                      "receipt_path": f"receipts/{lane}.md",
                      "receipt_sha256": receipt_sha256})
    return value


def generation(number: int, previous: str, state: str = "active",
               attempts: list[object] | None = None, events: list[object] | None = None,
               task_id: str = "20260715-120000-test", input_sha256: str = INPUT_SHA,
               final_sha256: str | None = None, receipt_sha256: str | None = None,
               barrier_generation: str = "1") -> bytes:
    attempts = attempts or []
    by_lane = {str(item["lane"]): str(item["attempt_id"]) for item in attempts if isinstance(item, dict)}
    after_barrier = state in {"ready", "synthesizing", "sponsor_blocked", "completed"}
    fields = {
        "artifact_type": "DualDesignRun", "task_id": task_id,
        "author_agent": "delivery-orchestrator", "status": "active",
        "schema_version": "1", "canonicalization_version": "dual-design-run-c14n-v1",
        "run_id": "run-1", "dual_marker": "true", "generation": str(number),
        "previous_generation_sha256": previous, "state": state,
        "input_sha256": input_sha256, "evidence_sha256": EVIDENCE_SHA,
        "frozen_input_handle": "design/input-package.md",
        "bold_current_attempt": by_lane.get("bold", "none"),
        "minimal_current_attempt": by_lane.get("minimal", "none"),
        "barrier_generation": barrier_generation if after_barrier else "none",
        "barrier_sha256": "pending" if after_barrier else "none",
        "attempts_json": json.dumps(attempts, separators=(",", ":")),
        "events_json": json.dumps(events or [], separators=(",", ":")),
    }
    if state == "completed":
        fields.update({"final_path": "design/architecture.md", "final_sha256": final_sha256 or "b" * 64,
                       "commit_operation_id": "commit-1", "commit_receipt_path": "receipts/commit-1.md",
                       "commit_receipt_sha256": receipt_sha256 or "d" * 64,
                       "commit_state": "committed"})
    if after_barrier:
        fields["barrier_sha256"] = barrier_sha256(fields, attempts)
    fields["generation_sha256"] = canonical_sha256(fields)
    body = "---\n" + "\n".join(f"{key}: {value}" for key, value in fields.items()) + "\n---\n\n# Run\n"
    return body.encode()


def run(entrypoint: Path, run_dir: Path, task: Path | None = None,
        task_root: Path | None = None) -> subprocess.CompletedProcess[str]:
    command = [sys.executable, str(entrypoint), str(run_dir)]
    if task:
        command += ["--task-record", str(task)]
    if task_root:
        command += ["--task-root", str(task_root)]
    return subprocess.run(command, text=True, capture_output=True)


def main() -> int:
    checks = 0
    with tempfile.TemporaryDirectory() as raw:
        root = Path(raw)
        task_root = root / "task-root"
        run_dir = task_root / "design/dual-design-runs/run-1"
        (task_root / "design").mkdir(parents=True)
        (task_root / "receipts").mkdir()
        final = task_root / "design/architecture.md"
        receipt = task_root / "receipts/commit-1.md"
        (task_root / "design/proposals").mkdir()
        final.write_text("normative final\n")
        receipt.write_text("immutable commit receipt\n")
        final_sha = hashlib.sha256(final.read_bytes()).hexdigest()
        receipt_sha = hashlib.sha256(receipt.read_bytes()).hexdigest()

        completed = []
        for lane in ("bold", "minimal"):
            proposal = task_root / f"design/proposals/{lane}.md"
            lane_receipt = task_root / f"receipts/{lane}.md"
            proposal.write_text(f"{lane} proposal\n")
            lane_receipt.write_text(f"{lane} receipt\n")
            completed.append(attempt(
                lane, "completed", hashlib.sha256(proposal.read_bytes()).hexdigest(),
                hashlib.sha256(lane_receipt.read_bytes()).hexdigest()))
        running = completed
        first = generation(0, "none", attempts=completed)
        first_path = atomic_publish_generation(run_dir, "generation-000000.md", first)
        from dual_design_run import parse_frontmatter
        first_hash = parse_frontmatter(first_path)["generation_sha256"]
        ready = generation(1, first_hash, "ready", attempts=completed, events=[{"event_id": "e1"}])
        ready_path = atomic_publish_generation(run_dir, "generation-000001.md", ready)
        ready_hash = parse_frontmatter(ready_path)["generation_sha256"]
        synthesizing = generation(2, ready_hash, "synthesizing", attempts=completed,
                                  events=[{"event_id": "e1"}, {"event_id": "e2"}])
        synth_path = atomic_publish_generation(run_dir, "generation-000002.md", synthesizing)
        synth_hash = parse_frontmatter(synth_path)["generation_sha256"]
        done = generation(3, synth_hash, "completed", attempts=completed,
                          events=[{"event_id": "e1"}, {"event_id": "e2"}, {"event_id": "e3"}],
                          final_sha256=final_sha, receipt_sha256=receipt_sha)
        atomic_publish_generation(run_dir, "generation-000003.md", done)
        for entrypoint in ENTRYPOINTS:
            result = run(entrypoint, run_dir, task_root=task_root)
            assert result.returncode == 0, result.stderr
            checks += 1

        try:
            atomic_publish_generation(run_dir, "generation-000003.md", b"replacement")
            raise AssertionError("overwrite unexpectedly succeeded")
        except FileExistsError:
            checks += 1

        (run_dir / ".staging" / ".crashed-partial").write_bytes(b"partial")
        assert run(ENTRYPOINTS[0], run_dir, task_root=task_root).returncode == 0
        assert not (run_dir / "generation-000004.md").exists()
        checks += 1

        missing = root / "missing"
        task = root / "task.md"
        task.write_text("---\nartifact_type: TaskRecord\ntask_id: 20260715-120000-test\nauthor_agent: delivery-orchestrator\nstatus: active\ndual_design_run_path: design/dual-design-runs/run-1\n---\n# Task\n")
        assert run(ENTRYPOINTS[0], missing, task).returncode == 1
        checks += 1
        assert run(ENTRYPOINTS[0], missing).returncode == 1
        checks += 1
        task.write_text(task.read_text().replace("dual_design_run_path: design/dual-design-runs/run-1\n", ""))
        assert run(ENTRYPOINTS[0], missing, task).returncode == 0
        checks += 1

        direct = root / "direct-completed"
        direct.mkdir()
        atomic_publish_generation(direct, "generation-000000.md",
                                  generation(0, "none", "completed", attempts=completed,
                                             final_sha256=final_sha, receipt_sha256=receipt_sha))
        assert run(ENTRYPOINTS[0], direct, task_root=task_root).returncode == 1
        checks += 1

        drift = root / "drift"
        drift.mkdir()
        drift_first = atomic_publish_generation(drift, "generation-000000.md", first)
        drift_hash = parse_frontmatter(drift_first)["generation_sha256"]
        atomic_publish_generation(drift, "generation-000001.md",
                                  generation(1, drift_hash, "active", attempts=running,
                                             input_sha256="f" * 64))
        assert run(ENTRYPOINTS[0], drift, task_root=task_root).returncode == 1
        checks += 1

        forged = root / "forged-barrier"
        forged.mkdir()
        forged_first = atomic_publish_generation(forged, "generation-000000.md", first)
        forged_hash = parse_frontmatter(forged_first)["generation_sha256"]
        atomic_publish_generation(forged, "generation-000001.md",
                                  generation(1, forged_hash, "ready", attempts=completed,
                                             barrier_generation="forged-generation"))
        assert run(ENTRYPOINTS[0], forged, task_root=task_root).returncode == 1
        checks += 1

        fabricated = root / "fabricated-attempts"
        fabricated.mkdir()
        fake_attempts = [attempt("bold", "completed"), attempt("minimal", "completed")]
        fake_first = atomic_publish_generation(fabricated, "generation-000000.md",
                                               generation(0, "none", attempts=fake_attempts))
        fake_hash = parse_frontmatter(fake_first)["generation_sha256"]
        atomic_publish_generation(fabricated, "generation-000001.md",
                                  generation(1, fake_hash, "ready", attempts=fake_attempts))
        assert run(ENTRYPOINTS[0], fabricated, task_root=task_root).returncode == 1
        checks += 1

        final.unlink()
        assert run(ENTRYPOINTS[0], run_dir, task_root=task_root).returncode == 1
        checks += 1
    print(f"OK: {checks}/{checks} DualDesignRun expectations hold")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
