---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: standards-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 规范审查发现

## 发现

### 发现 1：<标题>

- 严重度：<critical | major | minor>
- 置信度：<数值，按 SKILL.md 中的区间>
- 被违反的规则（原文引用，含规范文件和章节）：
- 违规（diff 中的文件路径和行号）：
- 影响：
- 建议：

## 其他车道 sighting

- 每条一行，写本审查员问题之外的真实问题（未成文但有害的做法、疑似 bug、看起来错误的规则）——绝不展开，绝不省略。没有时写“None”。

## 证据缺口

- 没有时写“None”。

## 残余风险

- 没有时写“None”。
- diff 未触及的行上已有的违规，每条一行，标记 `pre_existing`，放在这里。