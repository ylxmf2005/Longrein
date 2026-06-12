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

# 测试计划：Example Title

## 覆盖的需求

- FR-1 / AC-1：由下列检查覆盖。

## Must-Have 检查

- MH-1（P0）：要证明的行为、验证层级和证据。

## 禁区

- 绝对不能改变的区域。

## 风险排序与执行顺序

- 哪条 P0 是 gate、不过则哪些检查直接 blocked；各检查的执行先后。

## Capability 检查

- CAP-1（P1）：场景、执行命令、预期结果。

## 失败与边界情况

- EDGE-1：跨手册的 failure mode 与判定规则。

## 审计与日志

- 必需的日志/审计信号，以及禁止输出的敏感信息。

## 安全与 Token 约束

- Auth、permission、sandbox、token 或 rate-limit 检查。

## 覆盖度汇总

- requirement/capability：check id、验证层级、所在计划文件、E2E 目标（user-facing 能力没有 E2E 目标时，此列写省略理由）。

## 环境说明

- 环境类型、workdir、命令、URL、端口、凭据引用和 blockers。

## 测试上下文

- 依据的 `teamspace/testing-context.md` 状态（日期/版本）；本次为它补充了什么；省略某份执行手册时在此说明理由。

## 推荐 Tester 与分派

- API Contract Tester → `test/api-test-plan.md`；E2E Tester → `test/e2e-test-plan.md`；Regression Tester → `test/regression-test-plan.md`；需要时加 specialist 角色。

## 残余风险

- 没有时写“无”。

## 开放问题

- 没有时写“无”。
