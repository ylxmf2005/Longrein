---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专项审查发现

## 发现

### 发现 1：<标题>

- Severity: <critical | major | minor>
- Confidence: <数值，按 SKILL.md 中的区间；0.60 是报告下限>
- Evidence: <入口点 → 无防护路径 → 在 file:line 的 sink，以及你对中间件 / ORM / 配置的阅读结果>
- Impact: <攻击者得到什么>
- Recommendation: <漏洞边界处的最小改动——不要 wrapper 或超出范围的改写>

## 其他通道的 sightings

- 每条超出本审查者问题的真实问题（功能 bug、性能风险、可靠性缺口）一行——绝不展开，绝不遗漏。没有时写"none"。

## 证据缺口

- 没有时写"none"。

## 残余风险

- 没有时写"none"。
- 被 suppress 的低置信度发现如果属实将是 critical：每项一行，标记为未确认。
