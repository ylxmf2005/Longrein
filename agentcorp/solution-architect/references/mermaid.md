# 图（mermaid）的用法与校验

## 选型

让图类型贴合要回答的问题：

- `flowchart`——控制流/数据流、决策分支；整体架构全景图用 `flowchart` + `subgraph` 分组体现真实分层。
- `sequenceDiagram`——调用方与各服务之间随时间发生的交互、错误与 auth 分支。
- `classDiagram`——对象/类型之间的关系。
- `stateDiagram-v2`——有状态的行为、状态错乱类缺陷。
- `erDiagram`——存储与表结构、数据模型。

## 每张图都要带信息

图必须有信息、可推敲、方便人读，不是装饰：用真实的组件和边界；节点标签说清这一步「做了什么、保护了什么」，别只写一个光秃秃的名词；整体图用 `subgraph` 体现真实分层；成对的前后图节点要能对齐，改了什么一眼可见。一张图只回答一个问题——内容一密就拆开成多张。

## 语法校验

写完含 Mermaid 的产物后，必须用目标预览器/发布环境兼容的 Mermaid 版本校验语法；若不知道版本，优先使用保守语法（如 `graph TD`，选择旧版 parser 兼容的图语法）。本机缺少 `mmdc` 时先安装 `npm install -g @mermaid-js/mermaid-cli`；若目标环境版本较旧，可临时安装对应 `mermaid@<version>` 并用 `mermaid.parse` 逐个解析 code fence。正式产物保留源文档，交付说明报告校验结果。
