---
artifact_type: AcceptanceDecision
task_id: 20260603-120000-example-task
author_agent: acceptance-review-lead
status: accept
source_artifacts:
  - path/to/source.md
---

# Review Decision

## Decision

accept | reject | needs_more_evidence | blocked

## Basis

- 支撑本决策的直接证据——你打开过的文件，每个都附上它可检验的 handle（命令加输出、log 路径、截图）。每个 Must Have 都出现在这里或 Evidence Gaps 下，没有一条被无声略过。
- 对缺陷类任务：记录原始失败输入被重跑过，以及它产出了什么。

## Must Fix

- 没有就写 "None"。

## Should Fix

- 没有就写 "None"。

## Evidence Gaps

- 没有就写 "None"。

## Residual Risk

- 没有就写 "None"。

## Next Owner

- 负责下一步行动的 agent 或真人。
