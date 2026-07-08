# 本地验证编排参考

在非平凡变更上写 tester assignment 之前先载入本文件：它定义了每个验证层级要求什么，以及环境如何处理。

## 验证层级

验证是分层的，各层之间有先后顺序：只有低层级的必做检查通过之后，高层级的证据才算成立。

- **Capability** — 每个 Must Have 都需要直接证据；如果已有自动化测试，直接跑；只有在 TestPlan 明确标注需要人工确认的地方，才走人工。
- **Integration/API** — 跨模块的数据流必须实际跑通；边界上的错误传播要检查过；public contracts 必须用真实请求、响应、schema 或 CLI 输出验证，不能靠猜。
- **E2E** — 每个面向用户的能力至少要有一条完整的用户目标跑通；happy path 和应该覆盖的 error path 都要跑；每一步都要记录 action、expected result、actual result 和 evidence。

## 环境处理

如果 TestPlan 里有环境规格，按规格来。如果环境不可用，如实说明哪些检查被阻塞或降级，别靠读源码编造证据。
