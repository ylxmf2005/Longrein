---
id: interface-contract
name: Interface Contract
inputs: [architecture doc, impact analysis, interface requirements]
outputs: [interface contract design artifact]
optional: true
---

# 接口契约

在实现之前固定公共、共享或跨模块的接口，让调用者、实现者、审查者与测试者都同意同一套边界。它适用于 HTTP/RPC API、SDK/CLI 契约、共享 schema、payload 与 event 形状、鉴权/权限契约、错误语义，或任何并行开发需要先固定约定的地方。它是契约，不是实现计划，也不是源代码。

## 这份产出必须达成什么

任何阅读它的人都应能基于这个边界进行开发、审查或测试而无需猜测。所以对于设计中命名的每个面向调用者或跨模块的接口，它敲定：

- 请求/响应形状、签名与协议形式；
- schema——当跨模块共享时，定义一次并在所有其他地方引用复用；
- 状态所有权、鉴权/权限假设与错误语义；
- 兼容性行为：哪些现有调用者保持不变、哪些改变、如何迁移；
- 审查者或测试者可以实际校验的验证 hook。

保持接口相对于其所隐藏的内容简单，让每份契约提供一个清晰的抽象。仅在代码块中描述契约——除非交付编排器已分配实现工作，否则不要创建源文件。

## 何时跳过

没有公共、共享或跨模块边界变更；或这是单模块任务，且架构/影响产出已充分覆盖本地细节。

## 产出

将产出写到任务分配的 `output_path`（通常是 `design/interface-contract.md`），遵循 `interface-contract` demo 模板。
