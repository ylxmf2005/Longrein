# 落库解释格式

在用 `output_mode: artifact`（或 auto 模式强制落库）写解释时加载。SKILL.md 讲何时落库；这里讲落库的机制。

## 调用形式

```text
/agentcorp:explain output_mode=inline explain this test failure for a sponsor
/agentcorp:explain output_mode=artifact explain review/code-review.md item by item
Use $explain with output_mode=artifact to explain verification/verification-report.md.
```

## 路径

写到当前任务根目录：

```text
explain/<topic-slug>/
├── 00-index.md
└── <number>-<short-english-slug>.md
```

单份较长的解释就是一个文件：`explain/<topic-slug>.md`——不建目录、不建索引。当任务有独立的 Workspace 和 Location 时，在两侧保持相同相对 artifact 路径同步。这些是协作 artifact，不是源码改动；绝不 stage 或提交。

## 多项集合

一项一文件——一条 finding、一条测试结果、一个设计选择、一个实现点。索引列出每一项的一句话摘要和链接，让读者不必打开所有内容就能扫过整个集合。每个条目文件都必须自足、可乱序阅读：重述局部背景、具体论点、证据和当前状态。

## Frontmatter

每个落库文件都带：

```yaml
---
artifact_type: Explanation
task_id: <task-id>
author_agent: explain
status: completed
source_artifacts:
  - <artifact-or-file-this-file-explains>
---
```

在一个集合里，只有索引（`00-index.md`）使用 `artifact_type: ExplanationSet`；每个条目文件——以及任何单文件解释——使用 `Explanation`，其 `source_artifacts` 只写该文件所解释的对象。

## 语言

面向人的行文遵循 sponsor 的工作语言（AgentCorp 默认 zh-CN）；代码标识符、路径、枚举值和 frontmatter 字段保持原样。
