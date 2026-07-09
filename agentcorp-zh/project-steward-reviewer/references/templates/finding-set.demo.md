---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: project-steward-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# Project Steward Review 发现

## 发现

### 发现 1: <title>

- 严重程度: <P0 | P1 | P2 | P3>
- 置信度: <high | medium —— low confidence 的顾虑按住、不写进来>
- Rubric 维度: <据以判断的 stewardship-rubric 维度>
- 长期健康度影响: <未来由谁承担什么成本>
- 证据: <涉及代码处给 file:line；仓库级否定断言贴上检索命令及其结果>
- 建议:
- 路由: <review-fixer | implementation-planner | solution-architect | release owner | human owner>

## 给其它 lane 的旁见

- 落在本 reviewer 问题之外的每一个真实问题各写一行（一个疑似 bug、一处 security 苗头、一个 perf 风险）——永不展开、也永不丢弃。没有时写 "None"。

## 证据缺口

- 没有时写 "None"。

## 残余风险

- 没有时写 "None"。
