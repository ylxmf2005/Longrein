#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile


DIFF_FLAGS = [
    "-c",
    "core.quotepath=false",
    "-c",
    "diff.suppressBlankEmpty=false",
    "diff",
    "--no-color",
    "--no-ext-diff",
    "--no-textconv",
    "--find-renames",
]

FULLTEXT_MAX_BYTES = 5_000_000

HUNK_RE = re.compile(
    r"^@@ -(?P<old_start>\d+)(?:,(?P<old_lines>\d+))? "
    r"\+(?P<new_start>\d+)(?:,(?P<new_lines>\d+))? @@"
)


class ExtractError(Exception):
    pass


def fail(message):
    print(f"ERROR: {message}", file=sys.stderr)
    return 2


def decode(raw):
    return raw.decode("utf-8", errors="replace")


def hash12(payload):
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:12]


def hunk_id(old_path, new_path, header, lines):
    payload = (
        f"{old_path or ''}\0{new_path or ''}\0{header}\0"
        + "\n".join(line["op"] + line["text"] for line in lines)
    )
    return "h-" + hash12(payload)


def file_id(old_path, new_path, status):
    payload = f"{old_path or ''}\0{new_path or ''}\0{status}"
    return "f-" + hash12(payload)


def run_git(repo, args):
    cmd = ["git", "-C", str(repo)] + args
    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )
    except OSError as exc:
        raise ExtractError(f"failed to run git: {exc}") from exc
    if proc.returncode != 0:
        err = decode(proc.stderr).strip()
        detail = f": {err}" if err else ""
        raise ExtractError(f"git command failed ({' '.join(cmd)}){detail}")
    return proc.stdout


def rev_parse(repo, ref):
    return decode(run_git(repo, ["rev-parse", "--verify", ref])).strip()


def merge_base(repo, base, head):
    return decode(run_git(repo, ["merge-base", base, head])).strip()


def resolve_paths(repo_arg, out_arg):
    repo = Path(repo_arg).expanduser()
    if not repo.exists():
        raise ExtractError(f"repo does not exist: {repo}")
    repo_real = repo.resolve()
    repo_top = Path(
        decode(run_git(repo_real, ["rev-parse", "--show-toplevel"])).strip()
    ).resolve()

    out_real = Path(out_arg).expanduser().resolve()
    if out_real == repo_top or repo_top in out_real.parents:
        raise ExtractError(f"--out must be outside repo: {out_real}")
    return repo_top, out_real


def git_diff(repo, range_args):
    return run_git(repo, DIFF_FLAGS + range_args)


def git_name_status(repo, range_args):
    return run_git(repo, DIFF_FLAGS + ["--name-status", "-z"] + range_args)


def git_show(repo, rev, path):
    return run_git(repo, ["show", f"{rev}:{path}"])


def parse_status_code(status_field):
    if not status_field:
        raise ExtractError("empty file status from git")
    code = status_field[0]
    if code == "A":
        return "added"
    if code == "M":
        return "modified"
    if code == "D":
        return "deleted"
    if code == "R":
        return "renamed"
    raise ExtractError(f"unsupported git file status: {status_field}")


def parse_name_status(raw):
    tokens = decode(raw).split("\0")
    if tokens and tokens[-1] == "":
        tokens = tokens[:-1]
    files = []
    index = 0
    while index < len(tokens):
        status_field = tokens[index]
        index += 1
        status = parse_status_code(status_field)
        if status == "renamed":
            if index + 1 >= len(tokens):
                raise ExtractError("malformed --name-status output for rename")
            old_path = tokens[index]
            new_path = tokens[index + 1]
            index += 2
        else:
            if index >= len(tokens):
                raise ExtractError("malformed --name-status output")
            path = tokens[index]
            index += 1
            old_path = None if status == "added" else path
            new_path = None if status == "deleted" else path
        files.append(
            {
                "status": status,
                "old_path": old_path,
                "new_path": new_path,
            }
        )
    return files


def parse_diff_git_paths(line):
    rest = line[len("diff --git ") :]
    if not rest.startswith("a/"):
        raise ExtractError(f"malformed diff header: {line}")

    candidates = []
    search_from = 2
    while True:
        separator = rest.find(" b/", search_from)
        if separator == -1:
            break
        left = rest[:separator]
        right = rest[separator + 1 :]
        if left.startswith("a/") and right.startswith("b/"):
            candidates.append((left[2:], right[2:]))
        search_from = separator + 1

    if not candidates:
        raise ExtractError(f"malformed diff header: {line}")
    for old_path, new_path in candidates:
        if old_path == new_path:
            return old_path, new_path
    return candidates[-1]


def parse_marker_path(line, prefix):
    value = line[4:].split("\t", 1)[0]
    if value.startswith('"') and value.endswith('"'):
        value = value[1:-1]
    if value == "/dev/null":
        return None
    expected = f"{prefix}/"
    if value.startswith(expected):
        return value[2:]
    return value


def infer_status(item):
    if item["_rename_from"] is not None or item["_rename_to"] is not None:
        return "renamed"
    if item["old_path"] is None and item["new_path"] is not None:
        return "added"
    if item["new_path"] is None and item["old_path"] is not None:
        return "deleted"
    if item["old_path"] is not None and item["new_path"] is not None:
        return "modified"
    raise ExtractError("could not infer file status from raw diff")


def finalize_file_item(item):
    item["status"] = infer_status(item)
    for key in list(item):
        if key.startswith("_"):
            del item[key]
    item["id"] = file_id(item["old_path"], item["new_path"], item["status"])


def parse_diff(raw):
    raw_lines = raw.split(b"\n")
    if raw_lines and raw_lines[-1] == b"":
        raw_lines = raw_lines[:-1]
    lines = [decode(line) for line in raw_lines]
    files = []
    current = None
    current_hunk = None
    hunk_count = 0

    def finish_hunk():
        nonlocal current_hunk, hunk_count
        if current is None or current_hunk is None:
            return
        current_hunk["id"] = hunk_id(
            current["old_path"],
            current["new_path"],
            current_hunk["header"],
            current_hunk["lines"],
        )
        current["hunks"].append(current_hunk)
        hunk_count += 1
        current_hunk = None

    def finish_file():
        nonlocal current
        finish_hunk()
        if current is None:
            return
        finalize_file_item(current)
        files.append(current)
        current = None

    for line in lines:
        if line.startswith("diff --git "):
            finish_file()
            old_path, new_path = parse_diff_git_paths(line)
            current = {
                "id": "",
                "status": "",
                "old_path": old_path,
                "new_path": new_path,
                "is_binary": False,
                "hunks": [],
                "_rename_from": None,
                "_rename_to": None,
            }
            current_hunk = None
            continue

        if current is None:
            continue

        if line.startswith("@@ "):
            finish_hunk()
            match = HUNK_RE.match(line)
            if not match:
                raise ExtractError(f"malformed hunk header: {line}")
            current_hunk = {
                "id": "",
                "seq": len(current["hunks"]) + 1,
                "header": line,
                "old_start": int(match.group("old_start")),
                "old_lines": int(match.group("old_lines") or "1"),
                "new_start": int(match.group("new_start")),
                "new_lines": int(match.group("new_lines") or "1"),
                "lines": [],
            }
            continue

        if current_hunk is not None:
            if line == r"\ No newline at end of file":
                current_hunk["lines"].append({"op": "\\", "text": " No newline at end of file"})
                continue
            if line.startswith((" ", "+", "-")):
                current_hunk["lines"].append({"op": line[0], "text": line[1:]})
                continue
            raise ExtractError(f"unexpected diff line inside hunk: {line!r}")

        if line.startswith("new file mode "):
            current["old_path"] = None
            continue
        if line.startswith("deleted file mode "):
            current["new_path"] = None
            continue
        if line.startswith("similarity index "):
            continue
        if line.startswith("rename from "):
            current["_rename_from"] = line[len("rename from ") :]
            current["old_path"] = current["_rename_from"]
            continue
        if line.startswith("rename to "):
            current["_rename_to"] = line[len("rename to ") :]
            current["new_path"] = current["_rename_to"]
            continue
        if line.startswith("Binary files ") or line.startswith("GIT binary patch"):
            current["is_binary"] = True
            continue
        if line.startswith("old mode ") or line.startswith("new mode "):
            continue
        if line.startswith("index "):
            continue

        if line.startswith("--- "):
            current["old_path"] = parse_marker_path(line, "a")
            continue
        if line.startswith("+++ "):
            current["new_path"] = parse_marker_path(line, "b")
            continue

    finish_file()
    return files, hunk_count


def check_files_against_name_status(parsed_files, status_files):
    parsed_tuples = [
        (item["status"], item["old_path"], item["new_path"]) for item in parsed_files
    ]
    status_tuples = [
        (item["status"], item["old_path"], item["new_path"]) for item in status_files
    ]
    if parsed_tuples != status_tuples:
        raise ExtractError(
            "parsed diff file list does not match git --name-status output: "
            f"parsed={parsed_tuples!r} name_status={status_tuples!r}"
        )


def omitted_fulltext(item, reason):
    if reason in {"binary", "too-large"}:
        return {"old": "omitted", "new": "omitted", "omit_reason": reason}
    old_state = "absent" if item["old_path"] is None else "omitted"
    new_state = "absent" if item["new_path"] is None else "omitted"
    return {"old": old_state, "new": new_state, "omit_reason": reason}


def ok_fulltext(item):
    old_state = "absent" if item["old_path"] is None else "ok"
    new_state = "absent" if item["new_path"] is None else "ok"
    return {"old": old_state, "new": new_state, "omit_reason": None}


def text_size(text):
    return len(text.encode("utf-8"))


def read_worktree_side(repo, path):
    try:
        return (repo / path).read_bytes()
    except OSError as exc:
        raise ExtractError(f"failed to read worktree file {path}: {exc}") from exc


def attach_fulltext(repo, files, merge_base_sha, head_sha, include_worktree, no_fulltext):
    if no_fulltext:
        for item in files:
            item["fulltext"] = omitted_fulltext(item, "disabled")
        return None

    contents = {}
    for item in files:
        if item["is_binary"]:
            item["fulltext"] = omitted_fulltext(item, "binary")
            continue

        old_text = None
        new_text = None
        if item["old_path"] is not None:
            old_text = decode(git_show(repo, merge_base_sha, item["old_path"]))
        if item["new_path"] is not None:
            if include_worktree:
                new_text = decode(read_worktree_side(repo, item["new_path"]))
            else:
                new_text = decode(git_show(repo, head_sha, item["new_path"]))

        if (
            old_text is not None
            and text_size(old_text) > FULLTEXT_MAX_BYTES
            or new_text is not None
            and text_size(new_text) > FULLTEXT_MAX_BYTES
        ):
            item["fulltext"] = omitted_fulltext(item, "too-large")
            continue

        item["fulltext"] = ok_fulltext(item)
        if old_text is not None:
            contents[f"{item['id']}.old"] = old_text
        if new_text is not None:
            contents[f"{item['id']}.new"] = new_text
    return contents


def build_data(repo, base, head, include_worktree, no_fulltext):
    base_sha = rev_parse(repo, base)
    head_sha = rev_parse(repo, head)
    merge_base_sha = merge_base(repo, base, head)
    range_args = [merge_base_sha] if include_worktree else [f"{base}...{head}"]
    diff_raw = git_diff(repo, range_args)
    status_raw = git_name_status(repo, range_args)
    status_files = parse_name_status(status_raw)
    files, hunk_count = parse_diff(diff_raw)
    check_files_against_name_status(files, status_files)
    raw_hunk_count = sum(
        1 for line in diff_raw.split(b"\n") if decode(line).startswith("@@")
    )
    if raw_hunk_count != hunk_count:
        raise ExtractError(
            f"parsed hunk count {hunk_count} does not match raw diff count {raw_hunk_count}"
        )
    contents = attach_fulltext(
        repo, files, merge_base_sha, head_sha, include_worktree, no_fulltext
    )
    data = {
        "schema_version": 2,
        "base_ref": base,
        "base_sha": base_sha,
        "head_sha": head_sha,
        "merge_base": merge_base_sha,
        "include_worktree": include_worktree,
        "files": files,
    }
    return data, hunk_count, contents


def write_text(path, text):
    with path.open("w", encoding="utf-8", newline="") as handle:
        handle.write(text)
        handle.flush()
        os.fsync(handle.fileno())


def fsync_dir(path):
    try:
        fd = os.open(str(path), os.O_RDONLY)
    except OSError:
        return
    try:
        os.fsync(fd)
    finally:
        os.close(fd)


def remove_path(path):
    if path.is_dir() and not path.is_symlink():
        shutil.rmtree(path)
    else:
        path.unlink()


def unique_backup_path(out_dir):
    fd, name = tempfile.mkstemp(prefix=".contents.backup.", dir=str(out_dir))
    os.close(fd)
    os.unlink(name)
    return Path(name)


def write_outputs(data, out_dir, contents, no_fulltext):
    out_dir.mkdir(parents=True, exist_ok=True)
    target_diff = out_dir / "diff.json"
    target_contents = out_dir / "contents"
    diff_content = json.dumps(data, ensure_ascii=False, indent=1) + "\n"

    fd, tmp_diff_name = tempfile.mkstemp(
        prefix=".diff.", suffix=".tmp", dir=str(out_dir), text=True
    )
    tmp_diff = Path(tmp_diff_name)
    tmp_contents = None
    backup_contents = None

    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as tmp:
            tmp.write(diff_content)
            tmp.flush()
            os.fsync(tmp.fileno())

        if not no_fulltext:
            tmp_contents = Path(tempfile.mkdtemp(prefix=".contents.", dir=str(out_dir)))
            for name, text in contents.items():
                write_text(tmp_contents / name, text)
            fsync_dir(tmp_contents)

        if target_contents.exists() or target_contents.is_symlink():
            backup_contents = unique_backup_path(out_dir)
            os.rename(target_contents, backup_contents)

        if tmp_contents is not None:
            os.rename(tmp_contents, target_contents)
            tmp_contents = None

        os.replace(tmp_diff, target_diff)
        tmp_diff = None

        if backup_contents is not None:
            remove_path(backup_contents)
            backup_contents = None
        fsync_dir(out_dir)
    except Exception:
        if tmp_diff is not None and tmp_diff.exists():
            tmp_diff.unlink()
        if tmp_contents is not None and tmp_contents.exists():
            shutil.rmtree(tmp_contents)
        if target_contents.exists() and backup_contents is not None:
            remove_path(target_contents)
        elif target_contents.exists() and backup_contents is None and not no_fulltext:
            remove_path(target_contents)
        if backup_contents is not None and backup_contents.exists():
            os.rename(backup_contents, target_contents)
        raise
    return target_diff


def parse_args(argv):
    parser = argparse.ArgumentParser(
        description="Extract git diff hunks to diff.json",
        allow_abbrev=False,
    )
    parser.add_argument("--repo", required=True, help="target git repository")
    parser.add_argument("--base", required=True, help="base ref")
    parser.add_argument("--head", default=None, help="head ref (default: HEAD)")
    parser.add_argument("--out", required=True, help="output directory outside repo")
    parser.add_argument(
        "--include-worktree",
        action="store_true",
        help="compare merge-base to tracked worktree changes",
    )
    parser.add_argument(
        "--no-fulltext",
        action="store_true",
        help="omit contents/ fulltext output",
    )
    args = parser.parse_args(argv)
    if args.include_worktree and args.head is not None:
        raise ExtractError("--include-worktree cannot be combined with explicit --head")
    if args.head is None:
        args.head = "HEAD"
    return args


def main(argv):
    try:
        args = parse_args(argv)
        repo, out_dir = resolve_paths(args.repo, args.out)
        data, hunk_count, contents = build_data(
            repo,
            args.base,
            args.head,
            args.include_worktree,
            args.no_fulltext,
        )
        target = write_outputs(data, out_dir, contents, args.no_fulltext)
    except Exception as exc:
        return fail(str(exc))
    print(f"files={len(data['files'])} hunks={hunk_count} out={target}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
