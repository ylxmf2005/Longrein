---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: simplicity-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家 Review 发现项

## 发现项

### 发现项 1: <title — 命中四问标签之一时写进标题：`out-of-scope addition` | `reinventing the wheel` | `premature extraction` | `dead code` | `out-of-scope complexity`>

- 严重等级: <critical | major | minor>
- 置信度: <数值，按 SKILL.md 中的分档>
- 证据: <file:line，外加你实际运行过的命令（grep 调用方 / 现有实现）及其返回结果>
- 影响: <这份复杂性由谁支付，何时支付>
- 建议: <更简单的结构，以及为什么所需行为和 acceptance criteria 在它之下依然成立>

## 其他 lane 的旁观

- 每条一行，记录落在本 reviewer 问题之外的真实问题（一处疑似 bug、格式/history residue、一处 security smell）——绝不展开，也绝不丢弃。没有就写 "None"。

## 证据缺失

- 逐一写明每个从你所在位置确实无法运行的检查。没有就写 "None"。

## 残余风险

- 没有就写 "None"。
