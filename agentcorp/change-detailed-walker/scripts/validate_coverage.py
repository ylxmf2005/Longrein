#!/usr/bin/env python3
"""Validate hunk walkthrough comment coverage against diff.json."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


VALID_CLASSIFICATIONS = {
    "core",
    "supporting",
    "mechanical",
    "suspect-refactor",
    "suspect-residue",
    "untraceable",
}


@dataclass(frozen=True)
class CoverageUnit:
    id: str
    file: str
    context: str


@dataclass(frozen=True)
class ParsedComment:
    file: str
    line_no: int


class ValidationDataError(Exception):
    pass


def load_diff(data_dir: Path) -> dict[str, Any]:
    diff_path = data_dir / "diff.json"
    if not diff_path.exists():
        raise ValidationDataError(f"diff.json not found: {diff_path}")
    try:
        with diff_path.open("r", encoding="utf-8") as file_obj:
            data = json.load(file_obj)
    except json.JSONDecodeError as exc:
        raise ValidationDataError(f"diff.json is invalid JSON: {exc}") from exc
    except OSError as exc:
        raise ValidationDataError(f"diff.json cannot be read: {exc}") from exc
    if not isinstance(data, dict):
        raise ValidationDataError("diff.json root must be an object")
    if data.get("schema_version") != 2:
        raise ValidationDataError(f"unsupported diff.json schema_version: {data.get('schema_version')!r}")
    return data


def display_path(diff_file: dict[str, Any]) -> str:
    value = diff_file.get("new_path") or diff_file.get("old_path")
    return value if isinstance(value, str) else ""


def build_coverage_units(diff_data: dict[str, Any]) -> tuple[dict[str, CoverageUnit], list[str]]:
    files = diff_data.get("files")
    if not isinstance(files, list):
        raise ValidationDataError("diff.json files must be an array")

    units: dict[str, CoverageUnit] = {}
    duplicate_ids: list[str] = []
    seen_duplicates: set[str] = set()

    def add_unit(unit: CoverageUnit) -> None:
        if unit.id in units:
            if unit.id not in seen_duplicates:
                duplicate_ids.append(unit.id)
                seen_duplicates.add(unit.id)
            return
        units[unit.id] = unit

    for file_index, diff_file in enumerate(files, start=1):
        if not isinstance(diff_file, dict):
            raise ValidationDataError(f"diff.json files[{file_index}] must be an object")
        path = display_path(diff_file)
        hunks = diff_file.get("hunks")
        if not isinstance(hunks, list):
            raise ValidationDataError(f"diff.json file {path or file_index!r} hunks must be an array")
        if not hunks:
            file_id = diff_file.get("id")
            if not isinstance(file_id, str) or not file_id:
                raise ValidationDataError(f"diff.json file {path or file_index!r} id must be a non-empty string")
            status = diff_file.get("status")
            context = status if isinstance(status, str) and status else ""
            add_unit(CoverageUnit(file_id, path, context))
            continue
        for hunk_index, hunk in enumerate(hunks, start=1):
            if not isinstance(hunk, dict):
                raise ValidationDataError(
                    f"diff.json file {path or file_index!r} hunk {hunk_index} must be an object"
                )
            hunk_id = hunk.get("id")
            if not isinstance(hunk_id, str) or not hunk_id:
                raise ValidationDataError(
                    f"diff.json file {path or file_index!r} hunk {hunk_index} id must be a non-empty string"
                )
            header = hunk.get("header")
            context = header if isinstance(header, str) else ""
            add_unit(CoverageUnit(hunk_id, path, context))

    return units, duplicate_ids


def is_line_number(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def validate_code_refs(record: dict[str, Any]) -> str | None:
    if "code_refs" not in record:
        return None
    code_refs = record["code_refs"]
    if not isinstance(code_refs, list):
        return "code_refs must be an array"
    for index, code_ref in enumerate(code_refs, start=1):
        if not isinstance(code_ref, dict):
            return f"code_refs[{index}] must be an object"
        if "path" not in code_ref:
            return f"code_refs[{index}] missing path"
        if not isinstance(code_ref["path"], str) or not code_ref["path"]:
            return f"code_refs[{index}].path must be a non-empty string"
        if code_ref.get("side") not in {"old", "new"}:
            return f"code_refs[{index}].side must be old or new"
        start_line = code_ref.get("start_line")
        end_line = code_ref.get("end_line")
        if not is_line_number(start_line):
            return f"code_refs[{index}].start_line must be an integer"
        if not is_line_number(end_line):
            return f"code_refs[{index}].end_line must be an integer"
        if start_line < 1:
            return f"code_refs[{index}].start_line must be >= 1"
        if end_line < start_line:
            return f"code_refs[{index}].end_line must be >= start_line"
        if "label" in code_ref and not isinstance(code_ref["label"], str):
            return f"code_refs[{index}].label must be a string"
    return None


def validate_comment_object(record: Any) -> str | None:
    if not isinstance(record, dict):
        return "JSON value must be an object"

    for field in ("id", "file", "classification", "why", "trace"):
        if field not in record:
            return f"missing required field {field}"

    if not isinstance(record["id"], str) or not record["id"]:
        return "id must be a non-empty string"
    if not isinstance(record["file"], str) or not record["file"]:
        return "file must be a non-empty string"
    if not isinstance(record["classification"], str) or record["classification"] not in VALID_CLASSIFICATIONS:
        return f"classification must be one of {', '.join(sorted(VALID_CLASSIFICATIONS))}"
    if not isinstance(record["why"], str) or not record["why"].strip():
        return "why must be a non-empty string"
    if not isinstance(record["trace"], list):
        return "trace must be an array"
    if any(not isinstance(item, str) for item in record["trace"]):
        return "trace must be an array of strings"
    code_refs_problem = validate_code_refs(record)
    if code_refs_problem:
        return code_refs_problem
    return None


def parse_comments(comments_path: Path) -> tuple[dict[str, ParsedComment], list[str]]:
    comments: dict[str, ParsedComment] = {}
    bad_lines: list[str] = []

    try:
        with comments_path.open("r", encoding="utf-8") as file_obj:
            for line_no, raw_line in enumerate(file_obj, start=1):
                if not raw_line.strip():
                    continue
                try:
                    record = json.loads(raw_line)
                except json.JSONDecodeError as exc:
                    bad_lines.append(f"BAD_LINE {line_no}: invalid JSON: {exc}")
                    continue

                problem = validate_comment_object(record)
                if problem:
                    bad_lines.append(f"BAD_LINE {line_no}: {problem}")
                    continue

                comment_id = record["id"]
                if comment_id in comments:
                    print(f"WARN duplicate comment for {comment_id}, last one wins", file=sys.stderr)
                comments[comment_id] = ParsedComment(record["file"], line_no)
    except OSError as exc:
        bad_lines.append(f"BAD_LINE 0: cannot read comments file: {exc}")

    return comments, bad_lines


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate comments.jsonl coverage for diff.json.")
    parser.add_argument("--data", required=True, help="Directory containing diff.json.")
    parser.add_argument("--comments", help="comments.jsonl path. Defaults to <data>/comments.jsonl.")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    data_dir = Path(args.data)
    comments_path = Path(args.comments) if args.comments else data_dir / "comments.jsonl"

    try:
        diff_data = load_diff(data_dir)
        units, duplicate_ids = build_coverage_units(diff_data)
    except ValidationDataError as exc:
        print(f"ERROR {exc}", file=sys.stderr)
        return 2
    if duplicate_ids:
        for duplicate_id in duplicate_ids:
            print(f"DUPLICATE_ID {duplicate_id}")
        return 2

    comments: dict[str, ParsedComment] = {}
    bad_lines: list[str] = []
    comments_missing = not comments_path.exists()
    if not comments_missing:
        comments, bad_lines = parse_comments(comments_path)

    problems: list[str] = []
    problems.extend(bad_lines)

    for comment_id, comment in comments.items():
        if comment_id not in units:
            problems.append(f"UNKNOWN {comment_id} (line {comment.line_no})")
            continue
        unit = units[comment_id]
        if comment.file != unit.file:
            print(
                f"WARN file mismatch for {comment_id}: comment has {comment.file!r}, diff has {unit.file!r}",
                file=sys.stderr,
            )

    for unit in units.values():
        if unit.id not in comments:
            problems.append(f"MISSING {unit.id} {unit.file} {unit.context}")

    if problems:
        for problem in problems:
            print(problem)
        return 1

    print(f"COVERAGE OK: {len(units)}/{len(units)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
