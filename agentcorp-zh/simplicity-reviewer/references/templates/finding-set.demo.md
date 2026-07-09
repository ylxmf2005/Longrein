---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: simplicity-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专项审查发现

## 发现

### 发现 1：<标题——适用时包含四问题标签：`out-of-scope addition` | `reinventing the wheel` | `premature extraction` | `dead code` | `out-of-scope complexity`>

- Severity: <critical | major | minor>
- Confidence: <数值，按 SKILL.md 中的区间>
- Evidence: <file:line，以及你实际运行的命令（grep 调用者 / 现有实现）和它们返回的结果>
- Impact: <谁为这种复杂度买单，以及何时>
- Recommendation: <更简单的结构，以及为什么所需行为与验收标准能在它之下存活>

## 其他通道的 sightings

- 每条超出本审查者问题的真实问题（疑似 bug、格式化/历史残留、安全气味）一行——绝不展开，绝不遗漏。没有时写"None"。

## 证据缺口

- 列出每个在当前位置确实无法运行的检查。没有时写"None"。

## 残余风险

- 仅在确实为"None"时写"None"。
