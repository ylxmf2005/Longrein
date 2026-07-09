---
name: brainstorm
description: "当 AgentCorp 需要可复用的头脑风暴能力，在规划或实现之前澄清、拷问或重塑需求时使用，尤其是在 Delivery Orchestrator 的 validate-requirements 阶段，如果 sponsor 意图、成功标准、范围、用户旅程或方案方向还不清楚，就使用它。"
---

# Brainstorm

这是 AgentCorp 的通用思考能力，不是交付 phase，也不是带独立 gate 的角色。任何角色在当前工作需要这种行为时都可以加载它；它的主要归属是 `delivery-orchestrator` 的 `validate-requirements`。

目标是把不清楚的 request 变成经 sponsor 确认、可观察的需求。"不清楚"里藏着两种不同的缺口，它们需要不同的工具：

- **已知的未知（known unknowns）** —— sponsor 知道自己还没定下来的事实。用 **模式 1** 关闭它们：只问 repo 无法回答的聚焦问题。
- **未知的已知（unknown knowns）** —— sponsor 说不出来、但一眼就能认出的偏好。用 **模式 2** 让它们浮现：给出完整、真正不同的选项供其*反应* —— 反应便宜，凭空组织昂贵。
- **未知的未知（unknown unknowns）** —— sponsor 根本不知道存在的地带 —— 不归 brainstorm 这件工具管。在陌生领地，先运行 `probe`，让 brainstorm 立足于它的报告；就没人侦察过的地带去访谈 sponsor，只会把盲点洗白成需求。

Brainstorm 期间不要实现、不要做架构计划、不要写下游 artifact。把结果回填到所属 phase 的 artifact，通常是 `requirements/validated-requirements.md`。

**铁律：你的推荐是反应材料，绝不是决策。** 两种模式都要求你算出一个推荐默认项 —— 它存在的意义是让 sponsor 有具体东西可反应。在 sponsor 明确选择之前，任何东西都不会成为需求，无论你的默认项看起来多么显然，也无论 sponsor 回复得多慢。

## 运行原则

- **先验证意图，再确定形状。** 保留 sponsor 的关键原话，但要挖出背后的问题、目标用户、成功信号和非目标。
- **绝不问 repo 能回答的问题。** 任何问题送到 sponsor 面前之前，先检查代码、文档、历史 artifact 或 `teamspace/learnings/` 是否已有答案 —— 先去读，只问剩下的部分。一个 repo 本可以回答的问题，等于把工作量推回给委托这件事的人。
- **除非在比较方案，否则一次只问一个问题。** 缺事实就用聚焦追问；方向未定就给完整备选方案。
- **让 sponsor 反应，而不是凭空组织。** 每个问题都附带 2–4 个具体候选答案、各自隐含的取舍和你推荐的默认项；每个方向都以完整到可以选择、修改或拒绝的路径给出。白纸式提问是审讯者的做法。
- **事实判断要落地。** 如果答案依赖 repo 行为、产品文档、历史任务或 clone 下来的参考项目，先看证据再下结论 —— 并把 handle（`file:line`、命令加输出、文档路径）带进决策记录。
- **温和但认真地 grill。** 压力测试问题真实性、用户价值、范围、风险和更简单的方案，但不要把 sponsor 变成被审讯对象。
- **保持需求和实现边界。** Brainstorm 产品行为、旅程、成功标准和范围。表、模块、API、算法留给设计阶段，除非本次 brainstorm 明确就是技术选择。

## 模式 1：逐个追问

当方向大体清楚，但一两个事实会让 confidence 从 LOW 变成 MEDIUM/HIGH 时使用。

先默默列出完整问题清单，再按杠杆排序，**每轮只问一个**，杠杆最高的先问：先问答案会改变架构或数据模型的，然后是范围和可观察行为，再是旅程和 UX，最后才是外观细节。每个问题都附带候选答案、每个答案隐含的取舍，以及你会选哪个、为什么。

优先问能解锁 validated requirements 的问题：谁是主要用户或 actor；成功时必须能观察到什么；哪些明确不在范围内；这要替换当前什么行为或 workaround；sponsor 愿意接受哪种风险；什么情况会让这件事不值得做。

每得到一个回答，就把它并入持续更新的需求图景。**当剩余答案不再会改变方向时停止** —— 把剩下的记录为 assumptions 或 open questions，而不是继续问。如果下一个缺失事实仍会阻塞设计或测试计划，就把它问出来；如果 sponsor 无法或没有解决它，返回 `blocked`，并点名缺失的究竟是哪个事实。

## 模式 2：多方案提案

当 sponsor 的 request 指向了目标但没有给出形状，或多个合理形状会导向不同 validated requirements 时使用。给出 2–4 个完整路径，让 sponsor 选择。

详细规则加载 `references/proposal-paths.md`。简版：使用 AgentCorp proposal lenses，不要发明新角色；每个路径都必须完整到可以选择、修改或拒绝；路径之间必须真正分化 —— 两个只差措辞的路径其实是一个路径；至少让一个路径越过 sponsor 声明的口味，因为隐藏偏好只会在边界处现身；最终推荐只能使用已经在路径中出现过的材料。

**当未定的形状是视觉或交互性的** —— 一个页面、一份报告布局、一个 CLI 的手感 —— 纯文字路径不足以引发反应。把每个路径渲染成一次性的单文件原型（自包含 HTML，配真实感的假数据 —— lorem ipsum 会掩盖布局问题），放在任务根目录的 `brainstorm/prototypes/` 下，与所有 teamspace artifact 一样排除在 git 之外。原型只为被反应然后丢弃而存在，绝不能接入产品。

## Grounding

强事实判断前，先看最小有用证据集：

- probe 报告（如果存在）—— 它是 brainstorm 的领地地图
- 本地标准和上下文：`AGENTS.md`、`README*`、`STRATEGY.md`、`CONCEPTS.md`
- AgentCorp 历史 artifact：`teamspace/tasks/`、`teamspace/learnings/`、历史 requirements、plans、reviews
- 当有无某个能力会改变需求时，阅读相关产品文档或代码
- 只有 sponsor 要求，或决策依赖当前/第三方事实时，才查外部资料

研究外部仓库时，clone 到 `/tmp` 等临时位置，只作为证据阅读；除非 sponsor 明确授权，否则不要运行对方仓库里的脚本或 setup 命令。

## Grill 镜头

只用适合当前问题的镜头，不要把整张清单甩给 sponsor。需要更深入压力测试时，加载 `references/grill-lenses.md`。

## 危险信号 —— 一旦出现，立即停下重想

| 念头 | 现实 |
| --- | --- |
| "sponsor 还没回复 —— 我推荐的默认项足够好了。" | 推荐存在的意义是被反应，而不是被采纳。未经确认的默认项是一个 assumption：把它记录为 assumption 并保持问题开放，或返回 `blocked` —— 绝不能把它当作 sponsor 的决策折叠进去。 |
| "直接问 sponsor 就行，他们最清楚。" | 他们清楚的是自己的意图。repo 是否已经做了 X、当前行为是什么、历史任务试过什么 —— 那是你的功课，不该拿去问他们。 |
| "我去问他们想要什么样子。" | 未知的已知不会回答开放式问题；它们只对具体选项做出反应。改为展示 2–4 个真实备选。 |
| "凑够四个路径，显得周全。" | 只差措辞的路径是同一个路径注了水。价值在分化，不在数量。 |
| "所有路径都安全地待在他们要求的范围内。" | 隐藏偏好住在边界上。应该有一个路径越过声明的口味，让反应画出真正的线。 |
| "再多问一个问题没坏处。" | 每一轮都在消耗 sponsor 的注意力。当答案不再改变方向时，停止提问，记录 assumptions。 |
| "领地虽然陌生，但访谈会把它挖出来。" | 访谈只能挖出 sponsor 已知的东西。陌生领地需要先运行 `probe`，否则盲点会变成需求。 |

## 回填到 AgentCorp

向所属 phase 返回简洁的决策记录：

- 已选方向或选中的路径 —— 以及被拒绝的路径和 sponsor 给出的理由（拒绝记录编码了口味，否则下一轮还要重新争一遍）
- 使用 sponsor 语言表达的 sponsor intent
- 目标用户 / actor
- 可观察的旅程和成功标准
- must-have requirements
- 非目标和 MVP 边界
- assumptions 与 open questions
- 已查看的证据 —— 附 handle（路径、`file:line` 或命令加输出），不能只写来源名称，让所属 phase 可以复核

返回记录之前检查：每个标记为已选的方向都能追溯到 sponsor 的明确表态，而不是你的推荐；每个事实判断都带着 handle；assumptions 和 open questions 被如实标注，而没有折叠进 must-haves；如有原型，它们都在 `brainstorm/prototypes/` 下、未被 stage，且产品代码没有引用它们。

对 `validate-requirements` 来说，这份 synthesis 不是单独 gate。Delivery Orchestrator 要把它写进 validated requirements artifact，并且仍然需要 sponsor 的 human confirmation，requirements gate 才能通过。

## 角色集成

- **Delivery Orchestrator**：在 `validate-requirements` 中，confidence 为 LOW 或仍有多个形状时使用。缺事实用模式 1，方向未定用模式 2；当领地对 sponsor 或 orchestrator 都陌生时，建议先运行 `probe`。
- **Solution Architect**：只用它澄清产品意图，再进入设计；不能用它绕过 validated requirements。
- **Test Planner / Test Leader**：只有当成功标准或用户旅程模糊到无法测试时使用；澄清结果要回写到所属需求 artifact。
- **Review roles**：评审阶段不要重新打开需求，除非 artifact 模糊到阻塞评审；这种情况报告为 `needs_more_evidence`。
