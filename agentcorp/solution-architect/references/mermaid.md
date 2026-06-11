# 图（mermaid）的用法与校验

设计产物里需要画图时按本文执行。哲学见 SKILL.md：图是为了比文字更清楚地回答一个问题，不是装饰。

## 选型

让图的类型贴合你要回答的问题：

- `flowchart`——控制流/数据流，以及决策分支。
- `sequenceDiagram`——调用方与各服务之间随时间发生的交互。
- `classDiagram`——对象/类型之间的关系。
- `stateDiagram-v2`——有状态的行为。
- `erDiagram`——存储与表结构。

涉及增量时，前后对比的成对图往往最能讲清改动。每张图都要诚实、可推敲：用真实的组件和边界，节点标签要说清这一步「做了什么、保护了什么」，一张图只回答一个问题——内容一密就拆开。

## 语法校验

写完含 Mermaid 的产物后，必须用目标预览器/发布环境兼容的 Mermaid 版本校验语法；若不知道版本，优先使用保守语法（如 `graph TD`，选择旧版 parser 兼容的图语法）。本机缺少 `mmdc` 时先安装 `npm install -g @mermaid-js/mermaid-cli`；若目标环境版本较旧，可临时安装对应 `mermaid@<version>` 并用 `mermaid.parse` 逐个解析 code fence。正式产物保留源文档，交付说明报告校验结果。
