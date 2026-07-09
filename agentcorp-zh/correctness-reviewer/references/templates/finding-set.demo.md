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
- 置信度：按 SKILL.md 中的区间填写数值
- 证据：具体输入或状态，以及其在 file:line 处逐分支走过的路径
- 影响：错误的可观测结果，以及谁会触发它
- 推荐：修复方案；若缺少测试，请命名——其输入和应断言的结果

## 其他车道目击

- 本审查者问题之外的真实问题（安全气味、性能风险、结构问题）——永不展开，永不遗漏。若无则写“无”。

## 证据缺口

- 若无则写“无”。

## 残留风险

- 若无则写“无”。
- 被压制的低置信度发现，若属实则后果严重，在此列为一行，标记为未确认。
