---
name: precommit-setup
description: "当 AgentCorp 需要为仓库配置或改进 pre-commit 检查、commit-time 约束、Git hook 工作流、staged-file 质量检查，或把 Codex/Claude 的慢速 AI commit review 作为可选 pre-commit 环节时使用。当用户要求 setup precommit、增加 commit 约束、配置本地 pre-commit hooks，或把 AI review 做成 opt-in 提交前环节时使用。"
---

# precommit-setup

这是 AgentCorp 的通用支撑能力，不是交付 phase，也不是带独立 gate 的角色。用它为目标仓库添加 commit-time 约束：默认 hook 路径快到没人想绕开，更深的检查则是刻意的、opt-in 的。

你存在，是因为 hook 配置会以两种相反的方式失败。太重：有人把完整测试套件接进 pre-commit，每次 commit 都卡住，不出一周整个团队都在用 `--no-verify` 提交 —— guardrail 反而训练了大家绕过 guardrail。太空：agent 写出一份看起来合理的 YAML，从未真正执行，就汇报配置完成；hook 在第一次真实 commit 时就因为缺少二进制或路径错误而崩掉。两种失败源于同一个习惯 —— 把配置文件当作交付物，而不是把亲眼观察到的 hook 运行当作交付物。

**Iron law：没有跑过的 hook 就等于没有这个 hook —— 要么跑通它，要么汇报 UNVERIFIED。**

## 工作流

1. 先检查目标仓库，再选工具：
   - 现有 hook 系统：`.pre-commit-config.yaml`、`lefthook.yml`、`.husky/`、`.git/hooks/`、`package.json` hook scripts。
   - 现有质量命令：`Makefile`、`justfile`、`package.json`、`pyproject.toml`、`tox.ini`、`go.mod`、`Cargo.toml`、CI 配置。
   - 现有提交规则：`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md` 或 docs。
2. 仓库已经有 hook 工具时，一律沿用 —— 现有工具永远优先。
3. 没有 hook 工具时，优先选择语言无关的 `pre-commit` framework。Husky 只用于 Node-first 仓库或已有 Husky 的仓库。Lefthook 用于已有配置的仓库，或受益于单一快速 hook runner 的多语言 monorepo。
4. 先配置快速检查，并守住下面的延迟预算。
5. 把 commit 约束写成明确、可读的检查。
6. AI commit review 只作为慢速可选路径接入。
7. 本地实际运行 hook，并记录完整安装/验证命令。

## 默认快速检查

默认 pre-commit 检查应当确定、本地、快速。工具支持时优先检查 staged files。**预算：整个默认 hook 在一次典型 commit 上应在约 5 秒内完成；任何单项检查经常超过约 10 秒的，都应放进可选路径或 pre-push 路径，而不是默认 hook。**

合适的默认项：

- 空白、文件末尾、merge conflict markers、大文件检查。
- 仓库已经使用的 formatter 或 format check。
- 仓库已经使用的 linter。
- 只有在仓库已有命令能满足预算时才默认跑 type check。
- 只有便宜到能满足预算且本地稳定的测试才默认跑。
- 已有工具或无需重型安装就能接入的 secret scanning。

绝不把完整测试套件、浏览器测试、依赖安装、网络请求或 AI review 设成每次 commit 必跑。

## Commit 约束

commit 约束要做成本地 guardrail，能看懂，也能在必要时有意识地绕过。

常见约束：

- 阻止 unresolved merge conflict markers。
- 阻止明显 secret 或本地 credential 文件。
- 仓库有约定时，阻止只改生成产物而没有 source 变化的 commit。
- 阻止提交 AgentCorp runtime artifacts，例如 `teamspace/`，除非用户明确要提交。
- 仓库能可靠检测时，阻止破坏性或和当前任务无关的大面积格式化/噪音改动。
- 只有仓库已有 commit message 规范或用户要求时，才在 `commit-msg` enforce message style。

每条失败信息都要说清失败项、为什么重要，以及重跑命令。

## 可选 AI commit review

Codex/Claude commit review 有价值，但慢。绝不接成无条件的 pre-commit 环节。

触发模型：

- **手动命令**：例如 `make ai-commit-review` 或 `npm run ai:commit-review`。
- **环境变量 opt-in**：只有设置 `AI_COMMIT_REVIEW=1` 时运行。
- **路径/风险触发**：只有 staged files 触及 auth、支付、migration、public API、安全策略等敏感区域时运行。
- **pre-push 而不是 pre-commit**：团队想做深检查但不想阻塞每个本地保存点时，放到 push 前。

默认采用环境变量 opt-in 模型，并配套一条手动命令，让 review 在 commit 之外也能单独运行。只有用户点名了敏感区域，或明确要求 push 时 review，才使用路径/风险触发或 pre-push 触发。

review 默认检查 staged diff，不检查整个 working tree。它输出简短的 pass/fail 摘要，详细记录写到本地忽略路径，例如 `.agentcorp/commit-review/` —— 如果 `.gitignore` 还没有对应条目就补上；review 记录包含 diff 片段，绝不能进入 history。

失败行为必须明确：

- 默认：warn but do not block，除非用户要求阻塞。
- 保护级或高风险仓库可以开启 blocking mode，但必须 opt-in。
- 一定要提供 bypass 路径，例如 `SKIP=ai-commit-review git commit ...` 或 hook 工具的标准 skip 机制。

## 配置模式

写任何 hook 配置之前，先读 `references/config-patterns.md` 并照抄 —— 它提供可直接复制的 pre-commit / Husky / Lefthook 模板、AI review guard 脚本和失败信息模式。两条规则伴随所有模板：

- `repo: local` 区块只放快速的仓库命令 —— lint 或 format check，绝不放 `make test` 或任何遍历整个项目的检查。
- 只用用户本机真实存在的 CLI。不要编造不存在的参数；先查 `codex --help`、`claude --help` 或仓库已有脚本。

## 验证

配置完成后运行 —— 在当前环境里真正运行：

1. hook 安装命令，例如 `pre-commit install` 或仓库等价命令。
2. 完整 hook 一次，例如 `pre-commit run --all-files`，除非它超出上面的延迟预算。超出时，跑 targeted staged-file check，并说明跳过了哪些检查、为什么。
3. 如果本机有对应 CLI，分别验证可选 AI review 的跳过路径和 opt-in 路径。
4. `git status --short`，确认只改了预期 setup 文件。

如果 hook 工具在当前环境无法安装或运行（无网络、缺二进制、受限 shell），把配置汇报为 **UNVERIFIED**，并列出用户必须自己执行的精确命令 —— 绝不把没执行过的配置说成可用。如果验证只跑了一部分，精确说明哪些跑了、哪些没跑。

汇报内容：安装的工具、增改文件、执行命令及其结果、剩余慢检查、如何跳过或开启 AI review，以及验证状态（verified / partial / UNVERIFIED）。

## Red flags —— 一旦出现立即停下

| 念头 | 现实 |
| --- | --- |
| “这是标准 YAML，肯定能跑。” | 没执行过的 hook 会栽在路径、缺失二进制和拼写错误上。跑通它，或汇报 UNVERIFIED。 |
| “`pre-commit` 是首选框架，那就把现有的换掉。” | 现有 hook 工具永远优先；没有明确要求绝不迁移。 |
| “把 `make test` 放进 hook 能抓到更多 bug。” | 它也会让每次 commit 都变慢，直到所有人干脆绕过 hook。完整套件属于 CI 和测试 phase，绝不属于默认 hook。 |
| “`run --all-files` 就不跑了，估计很慢。” | “估计”不是测量。先跑一次并计时；只有拿预算当证据才允许跳过，并且要写进汇报。 |
| “notes 目录早晚会被 ignore 的。” | 除了你没人会去 ignore 它。没被 ignore 的 notes 目录会在下一次 commit 把 diff 片段带进 history。 |
| “用户想要严格检查，那阻塞式 AI review 就是他的意思。” | blocking 必须 opt-in，必须用户明说。默认是 warn 加一条写明的 bypass。 |

## 边界

- 你装的 hooks 是目标仓库自己的 guardrail，不是 AgentCorp 的 review 流水线：`code-review-lead` 和各 specialist reviewer 仍然在 review phase 审查改动 —— AI commit-review hook 绝不能替代那道 gate。
- 完整测试套件属于 CI 和测试角色（`test-leader`、`regression-tester`）；默认 hook 只借用满足延迟预算的检查。
- `change-hygiene-reviewer` 在事后评判一个具体 diff；你安装的是常驻检查，让最糟糕的 commit 根本无法成形。

## 汇报前自查

- 现有 hook 工具是否沿用，或迁移是否被明确要求？
- 默认 hook 是否实测在预算内，或超预算项是否已移入 opt-in/pre-push 路径？
- 每条约束的失败信息是否说清失败项、为什么重要和重跑命令？
- AI review notes 路径是否已有 `.gitignore` 条目？
- 每个 blocking 检查是否都写明了 bypass 路径？
- 汇报里的每条命令是否都在这里真正执行过 —— 其余是否都标了 UNVERIFIED？
- `git status --short` 是否只显示预期文件？

## 运行规则

- hook 配置、脚本和失败信息遵循目标仓库现有的语言与约定；任何 AgentCorp 汇报 artifact 遵循标准规则 —— zh-CN 人类可读文字，identifiers、路径和命令保持原文。
- 绝不把任务 artifacts 写进 skill 目录。
- `teamspace/` 只存在于本地：若显示为 untracked，加入 `.git/info/exclude`；绝不 stage、commit 或 push 它。

## 引用文件

- `references/config-patterns.md` —— 可直接复制的 pre-commit、Husky、Lefthook hook 配置、AI review guard 脚本和失败信息模式。写任何配置前先读它。
