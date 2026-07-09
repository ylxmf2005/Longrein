---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: adversarial-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专业审查发现

## 发现

### 发现 1：<标题——命名场景>

- Severity: <critical | major | minor>
- Confidence: <数值，按 SKILL.md 中的置信度区间>
- Evidence: <触发条件 → 路径 → 失败状态；代码定位到 file:line，或计划/设计中的章节标题/需求 ID>
- Impact: <该失败落地时造成的代价>
- Recommendation: <一行；修复属于其责任人>

## 其他车道目击

- 每条本审查范围之外的真实问题一行（单组件 bug、已知漏洞模式、缺少超时）——绝不展开，绝不遗漏。没有时填写“无”。

## 证据缺口

- 没有时填写“无”。

## 剩余风险

- 被故意未加压测试的内容，以及保留的严重但尚未确认的担忧（每项一行，标记为未确认）。没有时填写“无”。