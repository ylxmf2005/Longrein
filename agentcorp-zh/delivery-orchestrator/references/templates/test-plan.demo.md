---
artifact_type: TestPlan
task_id: 20260603-120000-example-task
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

# 测试计划：示例标题

## 覆盖的需求

- FR-1 / AC-1: 由以下检查覆盖。

## 必备检查

- MH-1 (P0): 需要证明的行为、验证层级和证据。

## 禁区

- 绝对不能变更的区域。

## 风险排序与执行顺序

- 哪个 P0 是关卡、如果它失败哪些检查立即被阻塞；检查的运行顺序。

## 能力检查

- CAP-1 (P1): 场景、运行命令、期望结果。

## 失败与边界情况

- EDGE-1: 跨手册的失败模式及其判定规则。

## 审计与日志

- 必需的日志/审计信号，以及绝不能输出的敏感信息。

## 安全与令牌约束

- 认证、权限、沙箱、令牌或速率限制检查。

## 覆盖摘要

- 需求/能力：检查 ID、验证层级、所在计划文件，以及 E2E 目标（当面向用户的能力没有 E2E 目标时，在此列说明省略原因）。

## 环境说明

- 环境类型、工作目录、命令、URL、端口、凭据引用和阻塞项。

## 测试上下文

- 所依赖的 `teamspace/testing-context.md` 状态（日期/版本）；此计划对其的补充；以及省略任何执行手册的原因。

## 建议测试员与分配

- API 契约测试员 → `test/api-test-plan.md`；E2E 测试员 → `test/e2e-test-plan.md`；回归测试员 → `test/regression-test-plan.md`；按需添加专项角色。

## 残余风险

- 如果没有，写"无"。

## 开放问题

- 如果没有，写"无"。
