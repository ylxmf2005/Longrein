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

- FR-1 / AC-1：由以下检查覆盖。

## 必须检查

- MH-1 (P0)：要证明的行为、验证级别和证据。

## 禁止区域

- 绝不可变更的区域。

## 风险排名和执行顺序

- 哪个 P0 是关卡、它失败时哪些检查立即被阻塞、检查运行的顺序。

## 能力检查

- CAP-1 (P1)：场景、运行命令、预期结果。

## 失败和边缘用例

- EDGE-1：跨手册的失败模式及其决策规则。

## 审计和日志

- 必需的日志/审计信号，以及绝不可发出的敏感信息。

## 安全和令牌约束

- 认证、权限、沙箱、令牌或速率限制检查。

## 覆盖摘要

- 需求/能力：检查 ID、验证级别、所在计划文件、E2E 目标（当面向用户的能力没有 E2E 目标时，在此列说明省略原因）。

## 环境备注

- 环境类型、工作目录、命令、URL、端口、凭证引用和阻塞项。

## 测试上下文

- 它所依赖的 `teamspace/testing-context.md` 状态（日期/版本）；此计划为其添加了什么；以及省略任何执行手册的原因。

## 推荐测试员和指派

- API 契约测试员 → `test/api-test-plan.md`；E2E 测试员 → `test/e2e-test-plan.md`；回归测试员 → `test/regression-test-plan.md`；按需添加专业角色。

## 残余风险

- 没有时写“None”。

## 开放问题

- 没有时写“None”。