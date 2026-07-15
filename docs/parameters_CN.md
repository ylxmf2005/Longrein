# 参数

[← 返回 README](../README_CN.md) · [English](parameters.md)

AgentCorp 的每一个旋钮,集中在这一页:接受什么值、默认是什么、拧动之后到底什么会变。

## 参数怎么用

所有 AgentCorp 参数都是写在调用文本里的 `key:value` 记号——`/agentcorp:probe output:inline`、`/agentcorp:delivery-orchestrator execution:delegated workflow:exhaustive 迁移 webhooks`。自然语言同义说法同样有效（“落库”等于 `output:artifact`；“赶时间”倾向更紧凑的 workflow）。三条规则处处成立：

- **未识别的 key** 记一行说明后忽略——绝不静默吞掉。
- **缺少承重参数值**时问一个短问题,绝不靠猜。
- **默认值保留广泛覆盖**：只有任务范围和风险允许，或发起人明确要求时，才选择更紧凑的 profile。

`workflow:` 刻意与宿主的推理设置解耦。它改变的是交付覆盖——团队规模、可选阶段、评审 lane 和验证层级——绝不改变已召集 agent 的认真程度。

## 总控的四个旋钮

| 旋钮 | 取值 | 默认 | 改变什么 |
| --- | --- | --- | --- |
| `execution:` | `direct` \| `hybrid` \| `delegated` | `hybrid` | 谁执行：总控独自完成 / 独立保障角色参与 / 所有可委派阶段均分派 |
| `interaction:` | `auto` \| `gate` | `auto` | 跳过可选人工暂停，或在每道人工门禁停下 |
| `workflow:` | `compact` \| `standard` \| `expanded` \| `exhaustive` | `expanded` | 召集多大团队、覆盖多少流程——见下表 |
| `lang:` | 任意语言 | 你书写的语言 | 每份面向人的产物用什么语言 |

## 每种 workflow profile 提供什么

workflow 缩放的是**组织**，从不缩放用心程度：被召集的 reviewer 没有“不那么仔细”的设置——profile 只决定召集谁、覆盖哪些流程。完整契约在 `agentcorp/delivery-orchestrator/references/workflow.md`（Workflow）；这里是用户视角：

| | `compact` | `standard` | `expanded`（默认） | `exhaustive` |
| --- | --- | --- | --- | --- |
| Intake | 0 个问题;小改动走快速路径 | 仅 micro 走快速路径 | ≤1 组改路线的问题 | 成功标准逐条确认 |
| 可选阶段 | 除非碰公共契约,全跳 | 触发条件明确才做 | 按文档条件 | 貌似有用就做 |
| Plan review | 跳过(tiny)或 1 条 lane | 5 条里的 3 条 | 全 5 条 + 风险 lane | 全部 + adversarial |
| Code review | 1 轮,主管独审(`depth:core`) | 1 轮,主管 + Correctness + 明确需要的 lane(`depth:lean`) | 1 轮 full + 限定范围修订(`depth:full`) | 至多 2 轮 full;边界 lane 也上 |
| 发现研究 | 仅 must-fix | 仅 must-fix | 主管路由的全部 | + 建议级条目 |
| Fix | 仅 P0 | P0+P1 | 全部 confirmed fix-now | + 合并后跑全量相关套件 |
| Verify | 1 个 tester,单元/简单检查 + 改动面回归 | 2 个 tester;贵的 e2e 除非 TestPlan 标了风险否则跳过 | 按 TestPlan | 全部,真实环境,从严 |
| 人工门禁 | 一次打包提议跳过 | 提议跳低风险门 | 按策略 | 零跳过提议 |
| 收尾 | `sweep:line`——一行诚实的"无可沉淀"即可 | `sweep:core`——回归问题必问 | `sweep:full`——三个沉淀问题全问 | + 一次 session 轨迹加练;walkthrough 保活到 merge |

成本锚：`compact` 约等于一次单 agent 会话；`exhaustive` 为每条 lane 各提供一个独立会话。

**任何 profile 都不能越过的底线**：证据绝不伪造；作者 ≠ 审批人；缺陷的原始失败输入必重跑；安全/权限/数据丢失面自动升级到 `exhaustive` 并明说。review、verify、acceptance 三个阶段会缩编，但永不消失。

## 各技能参数

| 技能 | 参数 | 取值 | 默认 | 改变什么 |
| --- | --- | --- | --- | --- |
| `brainstorm` | `mode:` | `questions` \| `proposals` | 按缺口类型选定并明说 | 逐问补事实 vs 多路径提案 |
| `code-review-lead` | `depth:` | `full` \| `lean` \| `core` | `full` | 召集的 lane:全名册 / Correctness+明确需要 / 主管独审 |
| `comment-optimizer` | `mode:` | `edit` \| `review` | `edit` | 就地改注释 vs 只出发现报告 |
| `compound` | `sweep:` | `line` \| `core` \| `full` | 派发时由 workflow profile 编译；独立运行默认 `full` | 对本轮盘问多用力：一行诚实的话 / 回归测试必问 / 三问全问 + 收拢便签 |
| `compound` | `session:` | `current` \| `last` \| `<path>` | `current` | 复盘时回放哪份会话 transcript |
| `compound` | `focus:` | `time` \| `tokens` \| `friction` \| `evolution` \| `project` \| `collaboration` \| `all` | `all` | 深挖哪个镜头 |
| `compound` | `output:` | `artifact` \| `inline` | `artifact` | 仅独立运行:完整复盘报告 vs 单问速答 |
| `explain` | `output:` | `inline` \| `artifact` | 自动(图示/多条目强制 artifact) | 解释落在哪 |
| `explain` | `reader:` | 任何人 | 发起人 | 为谁而写 |
| `grill` | `mode:` | `interview` \| `readiness` | `interview` | 完整逐问拷问 vs 单个就绪裁决 |
| `parallel-researcher` | `scope:` | `external` \| `repo` \| `both` | `both` | 证据搜哪边 |
| `parallel-researcher` | `depth:` | `desk` \| `source-verified` \| `hands-on` | 按决策所需 | 引证深度,最深到装起来跑 |
| `precommit-setup` | `runtime:` | `claude` \| `codex` \| `both` | 都配了取 both,否则取在场的,都没有则问 | 接哪个 runtime 的钩子 |
| `probe` | `output:` | `artifact` \| `inline` | 非平凡探测默认 `artifact` | 地形报告成文件 vs 就地说 |
| `skill-evolution` | `proposal:` | `<id>` \| `all` | 汇总待处理集并询问 | 处理哪些待定提案 |
| `walkthrough` | `format:` | `html` \| `md` | `html` | 自包含页面 vs markdown |
| `walkthrough` | `quiz:` | `on` \| `off` | `on` | 理解度关卡;`off` 仅限发起人明确放弃 |

敲命令时哪里能看到这些选项:每个技能的斜杠命令自动补全会显示同样的枚举(Claude Code 的 `argument-hint`);Codex 侧,技能的默认提示词以 `(options: …)` 列出。

**有意的 key 复用**：`mode:` 出现在三个技能、`depth:` 出现在两个技能，各有各的枚举——key 永远只在自己技能的作用域内，不跨技能传递。特别地，`code-review-lead` 的 `depth:` 数的是召集几条 lane，`parallel-researcher` 的 `depth:` 分的是证据严谨度。
