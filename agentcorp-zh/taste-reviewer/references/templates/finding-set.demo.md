---
artifact_type: SpecialistReviewFindingSet
task_id: 20260603-120000-example-task
author_agent: example-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-artifact.md
---

# 专家 Review 发现

## 发现

### 发现 1: <title>

- 严重程度: <critical | major | minor>
- 置信度: <数值，按 SKILL.md 中的分档>
- 证据: <那个 hack 构造的文件与行号，以及你 grep 类型/调用点/schema 看到了什么>
- 影响: <留着这个 hack 长期要付的代价>
- 建议: <诚实的形态和它的价>

## 证据缺口

- 没有时写 "None"。

## 残余风险

- 没有时写 "None"。
- 被按住的 low confidence 疑虑中，一旦为真会是 critical 级的写在这里：每条一行，标注 unconfirmed。对「该不该存在」的疑虑也写在这里，每条一行。
