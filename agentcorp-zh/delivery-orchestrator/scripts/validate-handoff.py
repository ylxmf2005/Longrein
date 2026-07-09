#!/usr/bin/env python3
"""验证 AgentCorp 交接信封（分配 / 回执 / 制品 frontmatter）。

仅做机械检查。不判断阶段质量或证据强度——
那是交付编排器的门禁职责。本脚本捕获自由文本 markdown 合约容易放行的
低成本、高频率疏忽（MAST FC1/FC2 族：违反任务/角色规范，推理-行动不匹配）：
回执声称的制品不存在或其作者/任务不一致、必填字段缺失、status 为空、
回执与其分配不匹配。

用法:
  validate-handoff.py FILE [FILE ...]
      验证每个文件的 frontmatter 形态（信封或制品）。
  validate-handoff.py --pair ASSIGNMENT RECEIPT [--task-root DIR]
      同时交叉检查回执与其分配及其命名的制品。
  validate-handoff.py --sweep --task-root DIR
      验证 DIR/handoffs/ 下的每一对分配/回执。

退出码 0 = 通过；1 = 违规（输出到 stderr）；2 = 用法错误。
仅使用 Python 3 标准库——不依赖 PyYAML。
"""

import os
import re
import sys

# 每种信封的必填标量键。制品（其他类型）需要通用集合。
ENVELOPE_REQUIRED = {
    "PhaseAssignment": ["task_id", "from_agent", "to_agent", "phase", "status", "output_path"],
    "PhaseReceipt": ["task_id", "from_agent", "phase", "status", "artifact_path"],
}
ARTIFACT_REQUIRED = ["artifact_type", "task_id", "author_agent", "status"]

# 软枚举：未知值发出警告（对漂移友好），不会导致运行失败。
# 保持此集合与 templates/ 示例指示代理写入的状态同步，
# 这样完全合规的运行保持无警告，警告才有意义。
KNOWN_STATUS = {
    "assigned", "in_progress", "active", "completed", "blocked",
    "needs_evidence", "needs_more_evidence", "implemented",
    "ready_for_review", "ready_for_plan_review",
    "ready_for_acceptance_review", "ready_for_triage",
    "approve", "request_changes", "accept", "reject", "needs_human",
    "passed", "failed", "partial",
}

# 带有以下状态之一的 TestExecutionResult 表示实际运行了，因此它必须在正文中
# 携带一个可检查的证据凭据——不仅仅是一个绿/红状态词。
TEST_STATUS_NEEDS_EVIDENCE = {"passed", "failed", "partial", "completed"}

_KV = re.compile(r"^([A-Za-z_][\w-]*):\s*(.*)$")


def parse_frontmatter(path):
    """返回 (标量字典, 错误或None)。仅提取平面标量键。"""
    try:
        with open(path, encoding="utf-8") as fh:
            text = fh.read()
    except OSError as exc:
        return None, f"无法读取文件: {exc}"
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, "第 1 行缺少开头 '---' frontmatter 分隔符"
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        return None, "缺少结尾 '---' frontmatter 分隔符"
    scalars = {}
    for raw in lines[1:end]:
        if not raw.strip() or raw[:1] in (" ", "\t", "-"):
            continue  # 空行、嵌套映射或列表项——非顶层标量
        m = _KV.match(raw)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        if len(val) >= 2 and val[0] == val[-1] and val[0] in ("'", '"'):
            val = val[1:-1]
        scalars[key] = val
    return scalars, None


def derive_task_root(receipt_path):
    """回执位于 <task_root>/handoffs/ 下；向上遍历以找到 task_root。"""
    d = os.path.dirname(os.path.abspath(receipt_path))
    while d and d != os.path.dirname(d):
        if os.path.basename(d) == "handoffs":
            return os.path.dirname(d)
        d = os.path.dirname(d)
    return None


def resolve_artifact(task_root, artifact_path):
    """将回执的 artifact_path 解析为 task_root 下的磁盘路径。"""
    candidate = os.path.join(task_root, artifact_path) if task_root else artifact_path
    if os.path.isdir(candidate):  # 文件夹制品（如 review/research/）-> 期望有索引
        idx = os.path.join(candidate, "00-index.md")
        return idx if os.path.exists(idx) else candidate
    return candidate


def check_shape(path, errors, warnings):
    """验证一个文件的 frontmatter 形态。返回标量或 None。"""
    scalars, err = parse_frontmatter(path)
    if err:
        errors.append(f"{path}: {err}")
        return None
    atype = scalars.get("artifact_type", "")
    required = ENVELOPE_REQUIRED.get(atype, ARTIFACT_REQUIRED)
    for key in required:
        if not scalars.get(key):
            errors.append(f"{path}: 缺少或为空的必填键 '{key}' (artifact_type={atype or '?'})")
    status = scalars.get("status", "")
    if status and status not in KNOWN_STATUS:
        warnings.append(f"{path}: status '{status}' 不在已知集合中（拼写错误？或更新 KNOWN_STATUS）")
    return scalars


def check_pair(assignment_path, receipt_path, task_root, errors, warnings):
    a = check_shape(assignment_path, errors, warnings)
    r = check_shape(receipt_path, errors, warnings)
    if not a or not r:
        return
    # 回执必须回应其配对的分配
    if a.get("to_agent") and r.get("from_agent") and a["to_agent"] != r["from_agent"]:
        errors.append(f"{receipt_path}: from_agent '{r['from_agent']}' != 分配的 to_agent '{a['to_agent']}'")
    if a.get("phase") and r.get("phase") and a["phase"] != r["phase"]:
        errors.append(f"{receipt_path}: phase '{r['phase']}' != 分配的 phase '{a['phase']}'")
    if a.get("task_id") and r.get("task_id") and a["task_id"] != r["task_id"]:
        errors.append(f"{receipt_path}: task_id '{r['task_id']}' != 分配的 task_id '{a['task_id']}'")
    # 回执的 artifact_path 应匹配分配的 output_path
    out, art = a.get("output_path", ""), r.get("artifact_path", "")
    if out and art:
        ok = art == out or (out.endswith("/") and art.startswith(out))
        if not ok:
            errors.append(f"{receipt_path}: artifact_path '{art}' 不匹配分配的 output_path '{out}'")
    check_artifact_exists(receipt_path, r, task_root, errors)


def check_artifact_exists(receipt_path, receipt, task_root, errors):
    art = receipt.get("artifact_path", "")
    if not art:
        return
    root = task_root or derive_task_root(receipt_path)
    resolved = resolve_artifact(root, art)
    if not os.path.exists(resolved):
        errors.append(f"{receipt_path}: 声称 artifact_path '{art}' 但文件不存在于 '{resolved}' "
                      f"（回执声称已完成，制品缺失）")
        return
    if os.path.isfile(resolved):
        scalars, err = parse_frontmatter(resolved)
        if err:
            return  # 制品可能合理地没有 frontmatter（如索引文件）——不对此报错
        if scalars.get("task_id") and receipt.get("task_id") and scalars["task_id"] != receipt["task_id"]:
            errors.append(f"{resolved}: task_id '{scalars['task_id']}' != 回执 task_id '{receipt['task_id']}'")
        author = scalars.get("author_agent", "")
        if author and receipt.get("from_agent") and author != receipt["from_agent"]:
            errors.append(f"{resolved}: author_agent '{author}' != 回执 from_agent '{receipt['from_agent']}'")
        # 实际运行的测试结果必须携带可检查的证据凭据，不仅仅是状态词。
        if scalars.get("artifact_type", "") == "TestExecutionResult" and scalars.get("status", "") in TEST_STATUS_NEEDS_EVIDENCE:
            check_test_evidence(resolved, scalars.get("status", ""), errors)


def check_test_evidence(artifact_path, status, errors):
    """实际运行的 TestExecutionResult 必须在正文中携带至少一个可检查的证据凭据
    ——一个制品/日志文件路径、一个 URL/MR/CI/日志链接，或一个非空的 fenced 命令输出块——
    这样发起人总有一个路径或摘录可以打开。单独的 'passed'/'failed' 词不算；
    .md 引用（如测试计划本身）也不算；空的 fence 也不算。"""
    try:
        with open(artifact_path, encoding="utf-8") as fh:
            text = fh.read()
    except OSError:
        return  # 存在性已由调用者报告
    lines, body = text.splitlines(), text
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                body = "\n".join(lines[i + 1:])
                break
    has_handle = bool(
        re.search(r"[\w./\-]+\.(log|jsonl|json|txt|csv|xml|html|png|jpg|jpeg|gif|out|har)\b", body)
        or re.search(r"https?://", body)
        or any(m.strip() for m in re.findall(r"```[^\n]*\n(.*?)```", body, re.S))
    )
    if not has_handle:
        errors.append(
            f"{artifact_path}: artifact_type=TestExecutionResult status='{status}' 但正文中未找到"
            f"可检查的证据凭据（至少需要以下之一：制品/日志文件路径、"
            f"URL/MR/CI/日志链接，或非空的 fenced 命令输出块）"
        )


def sweep(task_root, errors, warnings):
    handoffs = os.path.join(task_root, "handoffs")
    if not os.path.isdir(handoffs):
        errors.append(f"{handoffs}: 没有 handoffs/ 目录可扫描")
        return
    receipts = sorted(f for f in os.listdir(handoffs) if f.endswith("-receipt.md"))
    if not receipts:
        warnings.append(f"{handoffs}: 未找到 *-receipt.md 文件")
    for rf in receipts:
        receipt_path = os.path.join(handoffs, rf)
        assignment_path = os.path.join(handoffs, rf[: -len("-receipt.md")] + ".md")
        if os.path.exists(assignment_path):
            check_pair(assignment_path, receipt_path, task_root, errors, warnings)
        else:
            warnings.append(f"{receipt_path}: 未找到匹配的分配 '{os.path.basename(assignment_path)}'")
            r = check_shape(receipt_path, errors, warnings)
            if r:
                check_artifact_exists(receipt_path, r, task_root, errors)


def main(argv):
    args = argv[1:]
    task_root = None
    if "--task-root" in args:
        i = args.index("--task-root")
        try:
            task_root = args[i + 1]
        except IndexError:
            print("用法: --task-root 需要一个 DIR", file=sys.stderr)
            return 2
        del args[i : i + 2]

    errors, warnings = [], []
    if "--sweep" in args:
        if not task_root:
            print("用法: --sweep 需要 --task-root DIR", file=sys.stderr)
            return 2
        sweep(task_root, errors, warnings)
    elif "--pair" in args:
        i = args.index("--pair")
        rest = args[i + 1 :]
        if len(rest) < 2:
            print("用法: --pair ASSIGNMENT RECEIPT", file=sys.stderr)
            return 2
        check_pair(rest[0], rest[1], task_root, errors, warnings)
    elif args:
        for path in args:
            check_shape(path, errors, warnings)
    else:
        print(__doc__, file=sys.stderr)
        return 2

    for w in warnings:
        print(f"警告: {w}", file=sys.stderr)
    for e in errors:
        print(f"错误: {e}", file=sys.stderr)
    if errors:
        print(f"\n{len(errors)} 个交接违规。", file=sys.stderr)
        return 1
    print("交接验证通过" + (f"（{len(warnings)} 个警告）" if warnings else ""), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
