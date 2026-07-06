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

## Requirements covered

- FR-1 / AC-1: 由以下 check 覆盖。

## Must-Have checks

- MH-1 (P0): 待验证的行为、验证层与证据。

## Forbidden zones

- 绝不可触碰的区域。

## Risk ranking and execution order

- 哪些 P0 是 gate，以及它失败后会直接 block 哪些 check；check 的执行顺序。

## Capability checks

- CAP-1 (P1): 场景、执行命令、预期结果。

## Failure and edge cases

- EDGE-1: 跨 manual 的 failure modes 与决策规则。

## Audit and logging

- 必需的 log/audit 信号，以及禁止输出的敏感信息。

## Security and token constraints

- Auth、permission、sandbox、token 或 rate-limit 相关的 check。

## Coverage summary

- requirement/capability：check id、验证层、所在的 plan file、E2E goal（当某个面向用户的 capability 没有 E2E goal 时，在本列写明遗漏原因）。

## Environment notes

- Environment type、workdir、commands、URLs、ports、credential references 以及 blockers。

## Testing context

- 所依赖的 `teamspace/testing-context.md` 的状态（date/version）；本次新增的内容；此处写明遗漏任何 execution manual 的原因。

## Recommended testers and assignment

- API Contract Tester → `test/api-test-plan.md`；E2E Tester → `test/e2e-test-plan.md`；Regression Tester → `test/regression-test-plan.md`；按需补充 specialist 角色。

## Residual risk

- 没有就写 "none"。

## Open questions

- 没有就写 "none"。
