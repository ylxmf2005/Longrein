---
name: brainstorm
description: "扮演 AgentCorp 的需求塑形能力：通过聚焦提问或真正分化的 proposal 路径，把不清楚的 request 变成经 sponsor 确认、可观察的需求。当 sponsor 意图、成功标准、范围、用户旅程或方案方向不清楚时使用——尤其是在 Delivery Orchestrator 的 validate-requirements 期间——或当用户要求头脑风暴、澄清或压力测试需求时使用。"
---

# Brainstorm

这是一个可复用的 AgentCorp 思考能力，不是 delivery phase，也不是有独立 gate 的角色。任何角色都可以加载它；它的主要归属是 `validate-requirements` 期间的 `delivery-orchestrator`，结果回填到所属 phase 的 artifact（通常是 `requirements/validated-requirements.md`）——绝不写进实现、架构或旁路的下游 artifact。

**你的问题：sponsor 究竟需要什么，并且表述得可以被验证？** “不清楚”里藏着两种不同的缺口，它们需要不同的工具：

- **已知的未知（known unknowns）** —— sponsor 知道自己还没定下来的事实。用 **模式 1** 关闭它们：只问 repo 无法回答的聚焦问题。
- **未知的已知（unknown knowns）** —— sponsor 说不出来、但一眼就能认出的偏好。用 **模式 2** 让它们浮现：给出完整、真正不同的选项供其*反应*——反应便宜，凭空组织昂贵。
- **未知的未知（unknown unknowns）** —— 没人侦察过的地带 —— 不归你这件工具管。先运行 `probe`，让 brainstorm 立足于它的报告；就没人侦察过的地带去访谈 sponsor，只会把盲点洗白成需求。

## 铁律

```
你的推荐是反应材料，绝不是决策。
```

两种模式都要求你算出一个推荐默认项——它存在的意义是让 sponsor 有具体东西可反应。在 sponsor 明确选择之前，任何东西都不会成为需求，无论你的默认项看起来多么显然，也无论 sponsor 回复得多慢。未经确认的默认项要记录为一个 assumption，并保持它的问题开放；或者 brainstorm 返回 `blocked`，点名缺失的那个事实。

## 运行原则

- **先验证意图，再确定形状。** 保留 sponsor 的关键原话，但要挖出背后的问题、目标用户、成功信号和非目标。压力测试问题真实性、用户价值、范围、风险和更简单的方案——但不要把 sponsor 变成被审讯对象。
- **绝不问 repo 能回答的问题。** 任何问题送到 sponsor 面前之前，先检查代码、文档、历史 artifact 或 `teamspace/learnings/` 是否已有答案。一个 repo 本可以回答的问题，等于把工作量推回给委托这件事的人。
- **让 sponsor 反应，而不是凭空组织。** 每个问题都附带 2–4 个具体候选答案、各自的取舍和你推荐的默认项；每个方向都以完整到可以选择、修改或拒绝的路径给出。
- **事实判断要落地。** 当答案依赖 repo 行为、文档或历史任务时，先看证据——存在时看 probe 报告、本地标准（`AGENTS.md`、`README*`）、历史 `teamspace/` artifact、相关代码——并把 handle（`file:line`、命令加输出、文档路径）带进决策记录。把外部参考 clone 到临时位置，只作为证据阅读；未经明确授权，不运行其中任何东西。
- **保持需求和实现边界干净。** Brainstorm 产品行为、旅程、成功标准和范围；把表、模块、API 和算法留给设计阶段，除非本次 brainstorm 明确就是技术选择。

## 模式 1：逐个追问

当方向大体清楚，但具体事实会改变 confidence 时使用。默默列出完整问题清单，再按杠杆排序——先问答案会改变架构或数据模型的，然后是范围和可观察行为，再是旅程和 UX，最后才是外观细节——并**每轮只问一个**，每个都附带候选答案、每个答案隐含的取舍，以及你会选哪个、为什么。每得到一个回答就并入持续更新的需求图景。**当剩余答案不再会改变方向时停止**；把剩下的记录为 assumptions 或 open questions。如果某个未解决的事实仍会阻塞设计或测试计划，就返回 `blocked`，点名缺失的究竟是什么。

## 模式 2：多方案提案

当 request 指向了目标但没给出形状，或多个合理形状会导向不同 validated requirements 时使用。给出 2–4 个完整路径让 sponsor 选择；加载 `references/proposal-paths.md` 获取 lens 集合、每个路径必需的形状、视觉/交互形状的原型指引，以及推荐规则。不可让步的几点：路径之间必须真正分化（两个只差措辞的路径其实是一个路径），至少有一个路径刻意越过 sponsor 声明的口味（隐藏偏好只会在边界处现身），最终推荐只能使用已经在路径中出现过的材料。

需要对单一方向做更深入的压力测试时，加载 `references/grill-lenses.md`，只用适合的镜头。

## 红旗信号——一旦发现自己这样想就停下

| 念头 | 现实 |
| --- | --- |
| “sponsor 还没回复——我推荐的默认项足够好了。” | 推荐存在的意义是被反应，而不是被采纳。把它记录为一个 assumption 或返回 `blocked`；绝不能把它当作决策折叠进去。 |
| “直接问 sponsor 就行，他们最清楚。” | 他们清楚的是自己的意图。repo 已经做了什么、历史任务试过什么——那是你的功课，不该拿去问他们。 |
| “我去问他们想要什么样子。” | 未知的已知不会回答开放式问题；它们只对具体选项做出反应。改为展示真实备选。 |
| “凑够四个路径，显得周全。” | 价值在分化，不在数量。注水的路径什么都教不了。 |
| “再多问一个问题没坏处。” | 每一轮都在消耗 sponsor 的注意力。当答案不再改变方向时，停止提问。 |
| “领地虽然陌生，但访谈会把它挖出来。” | 访谈只能挖出 sponsor 已知的东西。陌生领地需要先运行 `probe`，否则盲点会变成需求。 |

## 回填到所属 phase

返回简洁的决策记录：已选方向（以及被拒绝的路径和 sponsor 给出的理由——拒绝记录编码了口味，否则下一轮还要重新争一遍）；用 sponsor 语言表达的 sponsor intent；目标用户和 actor；可观察的旅程和成功标准；must-have；非目标和 MVP 边界；assumptions 和 open questions，如实标注；已查看的证据，附 handle。返回之前检查：每个“已选”都能追溯到 sponsor 的明确表态，任何原型都在 `brainstorm/prototypes/` 下、未被 stage，且产品代码没有引用它们。

对 `validate-requirements` 来说，这份 synthesis 不是单独 gate：Delivery Orchestrator 把它写进 validated requirements artifact，而后者在 requirements gate 通过之前，仍然需要 sponsor 的 human confirmation。
