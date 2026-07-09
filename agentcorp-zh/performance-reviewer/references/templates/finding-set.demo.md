---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家审查发现

## 发现

### 发现 1：<标题>

- 严重度：<critical | major | minor>
- 置信度：<数值，按 SKILL.md 中的区间；medium 发现必须命名其所依赖的规模假设>
- 证据：<file:line 处的构造，加上可溯源的规模句柄——约束、schema、迁移或具名文档>
- 影响：<在可溯源规模下的成本——延迟、内存、吞吐量、资源耗尽>
- 推荐：<修复方案；仅在未缓存路径是热路径或慢路径有证据时才推荐缓存>

## 其他通道的现场发现

- 超出本审查者问题的实际问题（功能 bug、安全异味、可靠性缺口）——不展开，不遗漏。如果没有，写 "None"。

## 证据缺口

- 如果没有，写 "None"。

## 残余风险

- 如果没有，写 "None"。
- 被压制的低置信度发现——如果为真会导致故障——按未确认标记，每行一条。
