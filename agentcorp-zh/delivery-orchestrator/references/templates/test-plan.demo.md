---
artifact_type: TestPlan
task_id: example-task-20260603-120000
author_agent: test-planner
status: ready_for_review
source_artifacts:
  - requirements/validated-requirements.md
  - teamspace/testing-context.md
plan_files:
  - test/api-test-plan.md
  - test/e2e-test-plan.md
  - test/regression-test-plan.md
confidence: HIGH
---

# Test Plan: Example Title

## Requirements Covered

- FR-1 / AC-1: 由下方 check 覆盖。

## Must-Have Checks

- MH-1 (P0): 需验证的行为、verification level 与证据。

## Forbidden Zones

- 绝不可改动的区域。

## Risk Ranking and Execution Order

- 哪个 P0 作为 gate，一旦失败会立即 block 哪些 check；check 的执行顺序。

## Capability Checks

- CAP-1 (P1): 场景、执行命令与预期结果。

## Failure and Edge Cases

- EDGE-1: 跨越多份手册的 failure mode，以及对应的判定规则。

## Audit and Logging

- 必需的 logging/audit 信号，以及绝不可输出的敏感信息。

## Security and Token Constraints

- Auth、permission、sandbox、token 或 rate-limit 相关的 check。

## Coverage Summary

- requirement/capability：check id、verification level、所在 plan file 以及 E2E target（当面向用户的 capability 没有 E2E target 时，须在本列说明遗漏原因）。

## Environment Notes

- 环境类型、workdir、commands、URL、port、credential 引用及 blockers。

## Testing Context

- 所依赖的 `teamspace/testing-context.md` 状态（日期/版本）；本 plan 对其补充的内容；以及遗漏任何执行手册的原因。

## Recommended Testers and Assignment

- API Contract Tester → `test/api-test-plan.md`；E2E Tester → `test/e2e-test-plan.md`；Regression Tester → `test/regression-test-plan.md`；按需补充 specialist 角色。

## Residual Risks

- 若无则写 "None"。

## Open Questions

- 若无则写 "None"。
