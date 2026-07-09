---
name: precommit-setup
description: "在 AgentCorp 需要设置或改进仓库的 pre-commit 检查、提交时护栏、Git hook 工作流、暂存文件质量检查，或可选的慢速 AI 提交审查（Codex 或 Claude）时使用。当用户要求 setup precommit、添加提交约束、接入本地 pre-commit hooks，或让 AI 审查成为可选的 pre-commit 步骤时使用。"
---

# precommit-setup

这是 AgentCorp 的一项可复用支持能力，不是交付阶段，也不是带有自己关卡的角色。**你的问题是：这个仓库实际上会坚持使用哪些提交时护栏？** Hook 设置会以两种相反的方式失败：过重（完整测试套件放在 pre-commit 中 → 一周内所有人都会用 `--no-verify` 提交；护栏教会了人们绕过护栏）和过空（看似合理的 YAML 却从未执行 → 第一次真正的提交就会报错）。两者的共同习惯——把配置文件而非一次实际观察到的 hook 运行当作交付物。

## 铁律

```
A HOOK YOU HAVE NOT RUN IS A HOOK YOU DO NOT HAVE — RUN IT, OR REPORT UNVERIFIED.
```

## 工作流

1. 在选择工具前先检查：现有的 hook 系统（`.pre-commit-config.yaml`、`lefthook.yml`、`.husky/`、`.git/hooks/`、`package.json` 脚本），现有的质量命令（`Makefile`、`justfile`、`pyproject.toml`、CI 配置），现有的提交规则（`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md`）。
2. 现有 hook 工具总是优先——未经明确请求绝不迁移。若无现有工具，优先选择语言中立的 `pre-commit` 框架；Node 优先的仓库用 Husky；多语言 monorepo 或已使用 Lefthook 的仓库用 Lefthook。
3. 在延迟预算内配置快速检查，然后是约束，最后将 AI 审查作为慢速可选路径。
4. 运行 hook 并记录确切的安装/验证命令。

## 快速默认检查

确定性、本地、快速；优先使用暂存文件检查。**预算：整个默认 hook 在典型提交中约 5 秒内完成；任何单个检查经常在 10 秒以上则移至可选或 pre-push 路径。** 好候选（选择仓库已支持的——此列表为例示，非配额）：空白符/EOF/合并标记/大文件守卫，仓库自身的格式化工具和 linter，仅在预算内时才纳入的类型检查或定向测试，当工具已存在或 trivial to add 时的密钥扫描。完整测试套件、浏览器测试、依赖安装、网络调用和 AI 审查绝不作为每次提交的强制项——完整套件属于 CI 和测试阶段。

## 提交约束

本地护栏，易于理解，故意可绕过。常见约束：阻止未解决的冲突标记；阻止明显的密钥或凭证文件；阻止未伴随源文件变更的生成产物变更（当仓库有此惯例时）；阻止 AgentCorp 运行时工件（如 `teamspace/`），除非用户希望提交它们；仅在存在惯例或被请求时，在 `commit-msg` 中强制执行提交消息风格。每条失败消息说明什么失败、为什么重要，以及如何重新运行。

## 可选的 AI 提交审查

绝不要将 Codex/Claude 审查作为无条件的 pre-commit 步骤。触发模式：**手动命令**（`make ai-commit-review`）、**环境可选**（`AI_COMMIT_REVIEW=1`——默认关闭，配对手动命令）、**路径/风险驱动**（认证、支付、迁移、公共 API——仅在用户指明区域时），或 **pre-push**。它检查暂存 diff，返回简洁的通过/失败，并将详细注释写入 gitignored 路径，如 `.agentcorp/commit-review/`——你自己添加忽略条目；注释包含 diff 片段，绝不能进入历史。失败行为：默认警告；阻塞是可选的，且始终附带绕过方式（`SKIP=ai-commit-review git commit ...` 或工具的标准跳过方式）。AI 提交审查 hook 绝不能替代审查阶段的代码审查。

## 配置模式

在编写任何 hook 配置前，先阅读 `references/config-patterns.md` 并从中复制——即拷即用的 pre-commit / Husky / Lefthook 模板、AI 审查守卫脚本和失败消息模式。每条模板携带两条规则：`repo: local` 仅用于快速仓库命令，绝不用 `make test`；仅使用用户实际拥有的 CLI——在编写标志前先检查 `codex --help` / `claude --help` / 项目脚本。

## 验证

在此环境中实际运行：安装器（`pre-commit install` 或等效命令）；完整 hook 一次（`pre-commit run --all-files`）——若超出预算，运行定向的暂存文件检查并说明跳过了什么及原因；当 CLI 存在时，在跳过和可选模式下运行 AI 审查命令；`git status --short` 以确认仅预期文件发生变更。若工具无法在此安装或运行（无网络、无二进制、沙箱 shell），报告 **UNVERIFIED** 及用户必须运行的确切命令。报告：已安装工具、添加/变更的文件、运行的命令及结果、剩余慢速检查、绕过/可选指令，以及状态（verified / partial / UNVERIFIED）。

## 红旗——当你发现自己这样想时，停下来

| 想法 | 现实 |
| --- | --- |
| "配置是标准 YAML；它会工作的。" | 未执行的 hook 会在路径、缺失二进制和拼写上失败。 |
| "`pre-commit` 是首选，所以我会替换现有的。" | 现有工具优先。迁移需要明确请求。 |
| "`make test` 在 hook 中能捕获更多 bug。" | 它也会让每次提交变慢，直到人们完全绕过 hook。 |
| "我会跳过 `run --all-files`；它可能很慢。" | "可能" 不是测量。运行一次并计时；仅在预算作为证据时才跳过，并说明原因。 |
| "注释目录最终会被忽略的。" | 除了你，没人会忽略它——而且下次提交时会把 diff 片段带进历史。 |

## 输出

Hook 配置、脚本和失败消息遵循目标仓库的语言和惯例；任何 AgentCorp 报告工件保持 zh-CN 人类行文，标识符和命令原样保留。绝不要将任务工件写入技能目录；`teamspace/` 保持本地（若未追踪则添加到 `.git/info/exclude`；永不暂存、提交或推送）。
