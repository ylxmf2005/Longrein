# 持久化解释格式

在撰写 `output_mode: artifact`（或被 auto 模式强制要求）的解释时加载本文。SKILL.md 涵盖何时持久化；本文涵盖具体操作。

## 调用形式

```text
/agentcorp:explain output_mode=inline 向发起人解释本次测试失败
/agentcorp:explain output_mode=artifact 逐项解释 review/code-review.md
使用 $explain 并以 output_mode=artifact 解释 verification/verification-report.md。
```

## 路径

写入当前任务根目录下：

```text
explain/<topic-slug>/
├── 00-index.md
└── <number>-<short-english-slug>.md
```

单个实质性解释即为一个文件：`explain/<topic-slug>.md`——不需要目录，也不需要索引。当任务拥有独立的 Workspace 和 Location 时，保持相同的相对成果物路径在两边同步。这些是协作成果物，不是源码变更；绝不要暂存或提交它们。

## 多条目集合

每个条目一个文件——一个发现、一个测试结果、一个设计选择、一个实现要点。索引列出每个条目的一句话摘要和链接，以便读者无需打开全部文件即可扫览。每个条目文件必须做到无序且自包含：重述本地背景、具体要点、证据和当前状态。

## Frontmatter

每个持久化文件携带：

```yaml
---
artifact_type: Explanation
task_id: <task-id>
author_agent: explain
status: completed
source_artifacts:
  - <被本文件解释的artifact或文件>
---
```

在集合中，只有索引（`00-index.md`）使用 `artifact_type: ExplanationSet`；每个条目文件——以及任何单文件解释——使用 `Explanation`，其 `source_artifacts` 限定为被该文件解释的内容。

## 语言

面向人类的正文遵循发起人的工作语言（AgentCorp 默认简体中文 zh-CN）；保持代码标识符、路径、枚举值和 frontmatter 字段不变。
