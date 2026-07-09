# 实现 Story Spec 评审参考

在评审即将进入实现阶段的实现 Story Spec 时使用本参考。它必须让你确信：工程师可以从中直接开始构建，无需逆向工程任何缺失的决策。

要判断其是否成立，审视以下方面：

- 应有的部分全部存在且实质性——Story、Source Context、Acceptance Criteria、Tasks / Subtasks、Implementation Constraints、Verification Expectations、Review Focus、Status。
- 每条验收标准可观察，且可追溯到需求或设计/测试上下文。
- 每项任务/子任务绑定到一条验收标准，或在有用时绑定到明确的技术护栏。
- 目标模块/文件足够具体，能支撑首次实现。
- Implementation Constraints 涵盖架构/设计约束、现有代码上下文、接口/契约、禁区以及实现所需的参考资料。
- 增强/缺陷故事阐明必须保留的现有行为。
- 公共接口、数据 schema、认证/授权、可靠性、性能和安全性方面的风险，在相关时明确移交给专家评审。
- Verification Expectations 要么可由实现工程师执行，要么明确委托给测试负责人/测试员。
- 计划不会迫使实现工程师推断缺失的架构、捏造范围或选择未经批准的依赖。

据此判断：模糊的任务、缺失的验收标准、缺失的设计约束、模糊的目标、未经评审的接口变更、缺少回归标准的缺陷修复，或既无法执行也无法委托的验证期望——这些都应触发 `request_changes`。当需求、TestPlan、诊断证据、代码上下文或专家评审缺失，但一旦提供即可让你验证此 Story Spec 时，使用 `needs_more_evidence`。
