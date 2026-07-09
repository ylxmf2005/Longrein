---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: project-steward-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 项目管家评审发现

## 发现

### 发现 1：<标题>

- 严重程度：<P0 | P1 | P2 | P3>
- 置信度：<high | medium —— 低置信度顾虑应保留，不写入>
- 维度：<本发现所依据的 stewardship-rubric 维度>
- 长期健康影响：<谁承担什么未来成本>
- 证据：<涉及代码时 file:line；仓库范围负面主张时粘贴搜索命令及结果>
- 建议：
- 路由：<review-fixer | implementation-planner | solution-architect | release owner | human owner>

## 其他通道的观察

- 本评审员问题之外的真实问题（疑似 bug、安全气味、性能风险）每行一条——绝不展开，绝不丢弃。无则写 "None"。

## 证据缺口

- 无则写 "None"。

## 残余风险

- 无则写 "None"。
