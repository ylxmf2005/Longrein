# Local Acceptance Reference

在 verification 跑完、但还没 delivery 之前用这个。它把 SKILL.md 中的判断维度细化为通过/不通过的确认项；它不替代 SKILL.md。

## 你手里有哪些证据

acceptance 的结论得靠一整套证据撑起来：Delivery Orchestrator 给的 acceptance package、经过验证的 requirements、TestPlan、implementation notes 和 changed-file list、Code Review Lead 的决策，再加上 verification 过程中留下的 commands、requests、flows、screenshots、logs、artifacts，以及已知的 failures、untested areas 和 residual risks。这些东西合在一起，才是你做判断的底子——证据越直接、越可追溯，你的结论就越站得住。

## 什么算证据

- 可检验的 handle：跑过的命令加上它的输出、log 路径、截图、`verification/test-results/` 下的结果文件。一个没有 handle 的 status 词（`passed`、`fixed`、`done`）是声明，不是证据。
- 直接优于间接：一次真正演练了所需行为的运行，胜过对旁边某个 helper 的测试；TestPlan 要求真实 endpoint 的地方，真实的胜过 mock。
- 可追溯：你能从 Must Have 沿着 handle 一路走到 artifact，中间不需要靠推断补任何一步。

## 你必须确认什么

核心问题只有一个：这些证据能不能真正证明这次 delivery 满足了 requirements。要回答“能”，逐条确认：

- 每一条 Must Have 都有直接证据——一个你亲自打开过的 handle，而不是路径旁边的一个勾。
- 在需要分层验证的地方，capability、integration/API、E2E 按要求的顺序跑过；后面一层通过，不能豁免 TestPlan 要求、却被跳过的前面一层。
- TestPlan 要求真实 endpoint、command 或用户可见环境的地方，证据表明确实用了真的——去输出里找真实的 URL、host 或环境标记，而不是找“真实”这个词。
- scope 内的 risk，contract、data、security、performance、reliability 方面的证据到位。
- failures 被复现并修复，或者被诚实接受为 residual risk；对缺陷类任务，修复针对原始失败输入重跑过并产出正确结果——只有代理样本不能关闭一个缺陷。
- 没有任何结论是建立在隐式 fallback、mock-only 的成功、或者纯靠源码推断之上的。

## 结论

- `accept`: 证据支持 delivery，且 residual risk 可接受。
- `reject`: 所需行为失败，或 risk 不可接受。
- `needs_more_evidence`: 活儿本身可能是对的，但证据缺失、间接或不完整——指出缺的那个 handle。
- `blocked`: 过于模糊、无法诚实判断；确切指出缺什么，而不是把它编出来。

高风险发布另外遵循 SKILL.md 中的跨家族二次意见规则。
