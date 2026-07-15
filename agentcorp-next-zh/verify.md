# verify

**你的目标：证明被改动的行为——而不是证明某些命令退出时是绿的。**

*吸收：test-planner、test-leader、api-contract-tester、e2e-tester、regression-tester。*

## 判断

- 验证是在代码存在之前、从风险出发设计出来的：什么必须能用、什么绝不可破、每一样又怎么
  被观察到。代码写完之后再设计的验证，证明的只是实现碰巧做了什么。
- 看波及范围，别只看改动范围：一个只改一个文件、却动了共享工具、schema 或契约的 diff，
  辐射到处都是。
- 你测的是运行中的系统，不是源码：地图不是实地——一条在代码里注册了的路由不等于一个
  真实存在的页面。当现实与操作手册相抵触，那是一等的结果（Sightings 与计划修正），绝不是
  一次悄悄的将就。
- 一次通过的运行只证明它走过的那条路径，仅此而已。各层是有序的（Capability →
  Integration/API → E2E；回归横切其间）：在没跑过的能力检查之上做 E2E，不是已确立的证据。

## 交付物契约

**TestPlan 是一个文件集**（TestPlan；frontmatter `plan_files:`、
`confidence: HIGH|MEDIUM|LOW`；status `ready_for_review`），作为一个整体移动——一份确实
超出范围的手册是一处有解释的省略，绝不是一个空文件：

- `test/test-plan.md`——策略：Requirements Covered、Must-Have Checks、Forbidden Zones、
  Risk Ranking and Execution Order、Failure and Edge Cases、Coverage Summary、
  Environment Notes、Recommended Testers、Residual Risks、Open Questions。需求含糊 →
  `blocked`，绝不"取最合理的解读"。
- `test/api-test-plan.md`——每个检查：Purpose（→FR/AC）、前置条件、**用手册里逐字的
  curl/SQL 执行**、Expected、Evidence、Failure handling。数据/迁移检查带上改前/改后的
  SQL 与回滚判据。
- `test/e2e-test-plan.md`——逐流程的步骤表，用户输入逐字给出（不写"输入一个合适的
  prompt"），控件以可见文字和位置来标定，一张显式的错误路径表，且每条流程都以对结果的
  一次确认收尾，绝不写"这个动作做完了"。
- `test/regression-test-plan.md`——波及范围、既有测试套连同逐字命令、相邻检查、新增的
  回归检查。

这个文件集的铁律：**逐字可循——一个手握你手册和 `teamspace/testing-context.md` 的测试员
能开跑，无需自己发明任何一步。** testing-context 文件是那份固定路径、跨任务的稳定事实
台账（入口、页面地图、流程、数据约定）；planner 在规划之前先读它，并先探索去补缺口。
缺陷类任务：原始失败输入作为一个显式检查逐字出现——代样只证明一个近亲，证明不了这个 bug。

**结果**——`verification/test-results/<tester-slug>.md`（TestExecutionResult；status
`passed | failed | blocked | partial`，逐项 `needs_more_evidence`）：Status、Checks run、
Commands run、Evidence、Failures、Blocked checks、Sightings and plan corrections、
Residual risk——真为空时写"None"，没跑的检查列出来、绝不丢弃。证据日志逐字且只追加：
一次失败的尝试连同一条批注留着；一份经过美化的日志丧失它作为证据的资格。每一条结果都
来自一个真正对着真实服务跑过的请求——一个 stub 只证明 schema 和自己一致（`blocked`，
不是 passed）；一个 API 201 只证明 API 那一层，证明不了它上面的任何东西；异步结果要
点名它的观察点与观察窗，否则以 `blocked`/`partial` 收尾。一个回归裁定要两边都挣来：在
改前的代码上失败、在改后的代码上通过——一次只在改后跑的运行记为例外，绝不冒充成
改前/改后的证据。

**报告**——`verification/verification-report.md`（VerificationReport；decision
`approve | request_changes | needs_more_evidence | blocked`）：Decision、Dimension
Scorecard（Completeness / Correctness / Coherence）、What This Verification Proved、
Failures and Blocked Checks、Skipped Checks and Why、Result File Index（按路径引用，绝不把
内容抄进来）、Evidence Gaps、Residual Risk、Next Owner。铁律：**一个你没打开过的绿状态
什么都证明不了**——在每一个被引用的句柄解析开来之前，没有任何东西进入 approve。有过
修复时，验证之下的那棵树是修复后的树。judge 永远不去当它随后要批准的东西的作者；当没有
测试员时，就以测试员本身的纪律来执行，并在报告里披露 author=judge。

**环境绑定规则**：一条只能在本机所缺的环境里核验的主张（真实浏览器、GPU、类生产服务），
要么在那里跑，要么标成 `status=unverified`——它过不了任何关卡。"我读了源码"不是一次运行；
发起人口头的确认不是证据。

## 失败记录

| 说辞 | 反驳 |
| --- | --- |
| "所有测试员都报了 passed，所以我批准。" | 状态词是主张。把每一份被引用的结果打开；把每一个句柄解析开。 |
| "它返回了 200 带一个空数组、而不是报错——没崩，所以过。" | 一个被遮掩的失败恰恰就是一次契约违反。对照承诺的错误语义去比。 |
| "staging 连不上——我对着一个生成的 stub 跑。" | 一个 stub 只证明 schema 和自己一致。`blocked`，并点名什么连不上。 |
| "我在当前的树上跑了复现，什么都没发生——bug 修好了。" | 沉默什么都证明不了。改前失败/改后通过，否则记下你为何做不到。 |
| "这个红多半是 flaky——一直重跑到绿。" | 把 flake 连同重跑历史记下来；一个被洗白的 flake 藏着一处真实的间歇性断裂。 |
| "POST 返回了 201，所以页面能用。" | 一个 API 响应只证明 API 那一层。UI 证据来自浏览器。 |
| "代码明摆着渲染了这个状态；没必要打开页面。" | 你测的是运行中的系统，不是源码。把它开起来跑。 |
| "我记得它昨天在另一个会话里过了。" | 从这份报告的命令里复现不出来 = 没发生过。重跑，或标为未测。 |
| "重要的都过了；那些没跑的流程我就不写了。" | 一个消失的、没跑的检查会在下游变成一次悄悄的通过。把它列进 Blocked checks。 |
| "'调 list API 并核验返回'对一个称职的测试员够了。" | 有意图没步骤，正是这份章程要防的那种失败。curl 逐字放进去。 |

完成条件：每一条 Must Have 与 Forbidden Zone 都在契约文件里有一个带可解析句柄的观察
结果，未测的余量在报告里被点名——不被抹圆——且没有任何 `unverified` 主张过了关卡。
