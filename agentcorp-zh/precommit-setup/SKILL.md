---
name: precommit-setup
description: "当 AgentCorp 需要为仓库配置或改进 pre-commit 检查、commit-time 约束、Git hook 工作流、staged-file 质量检查，或把 Codex/Claude 的慢速 AI commit review 作为可选 pre-commit 环节时使用。当用户要求 setup precommit、增加 commit 约束、配置本地 pre-commit hooks，或把 AI review 做成 opt-in 提交前环节时使用。"
---

# precommit-setup

这是一个可复用的 AgentCorp support 能力，不是 delivery phase，也不是带独立 gate 的角色。**你的问题：这个 repo 真正会一直用下去的 commit-time guardrail 是什么？** hook 配置会以两种相反的方式死掉：太重（把完整测试套件接进 pre-commit → 不出一周所有人都在用 `--no-verify` 提交；guardrail 反而训练了大家绕过 guardrail）和太空（看起来合理、却从未执行的 YAML → 在第一次真实 commit 时就崩掉）。两者共享同一个习惯——把配置文件、而不是亲眼观察到的 hook 运行，当作交付物。

## 铁律

```
没有跑过的 hook 就等于没有这个 hook——要么跑通它，要么汇报 UNVERIFIED。
```

## 工作流

1. 选工具前先检查：现有 hook 系统（`.pre-commit-config.yaml`、`lefthook.yml`、`.husky/`、`.git/hooks/`、`package.json` scripts）、现有质量命令（`Makefile`、`justfile`、`pyproject.toml`、CI 配置）、现有提交规则（`AGENTS.md`、`CLAUDE.md`、`CONTRIBUTING.md`）。
2. 现有 hook 工具永远优先——没有明确要求绝不迁移。没有任何工具时，优先选语言无关的 `pre-commit` framework；Node-first 仓库用 Husky；多语言 monorepo 或已在用的仓库用 Lefthook。
3. 先在延迟预算内配置快速检查，然后是约束，然后把 AI review 作为慢速 opt-in 路径。
4. 运行 hook，并记录完整的安装/验证命令。

## 默认快速检查

确定、本地、快速；优先检查 staged files。**预算：整个默认 hook 在一次典型 commit 上约 5 秒内完成；任何单项检查经常超过约 10 秒的，移入 opt-in 或 pre-push 路径。** 合适的候选项（挑仓库已经支持的——这是示例，不是配额）：空白/EOF/merge-marker/大文件检查、仓库自己的 formatter 和 linter、只在满足预算时才跑的 type check 或定向测试、有工具或极易接入时的 secret scanning。完整测试套件、浏览器测试、依赖安装、网络请求和 AI review 绝不设成每次 commit 必跑——完整套件属于 CI 和测试 phase。

## Commit 约束

本地 guardrail，易懂，刻意可绕过。常见项：阻止 unresolved conflict markers；阻止明显 secret 或 credential 文件；阻止只改生成产物而没有 source 变化的 commit（仓库有这个约定时）；除非用户要提交，否则阻止 `teamspace/` 之类的 AgentCorp runtime artifact；只有已有约定或用户要求时，才在 `commit-msg` enforce message style。每条失败信息都说清失败项、为什么重要，以及重跑命令。

## 可选 AI commit review

绝不把 Codex/Claude review 接成无条件的 pre-commit 环节。触发模型：**手动命令**（`make ai-commit-review`）、**环境变量 opt-in**（`AI_COMMIT_REVIEW=1`——默认模型，配套一条手动命令）、**路径/风险触发**（auth、支付、migration、public API——只在用户点名这些区域时）、或 **pre-push**。它检查 staged diff，返回简短的 pass/fail，并把详细记录写到 gitignore 的路径，例如 `.agentcorp/commit-review/`——ignore 条目由你自己补上；记录含 diff 片段，绝不能进入 history。失败行为：默认 warn；blocking 是 opt-in，且永远配套一条 bypass（`SKIP=ai-commit-review git commit ...` 或工具的标准 skip）。AI commit-review hook 绝不替代 review phase 的 code review。

## 配置模式

写任何 hook 配置前，先读 `references/config-patterns.md` 并照抄——可直接复制的 pre-commit / Husky / Lefthook 模板、AI review guard 脚本和失败信息模式。两条规则伴随所有模板：`repo: local` 只放快速的仓库命令，绝不放 `make test`；只用用户真实拥有的 CLI——写参数前先查 `codex --help` / `claude --help` / 项目脚本。

## 验证

在当前环境里真正运行：安装命令（`pre-commit install` 或等价命令）；完整 hook 一次（`pre-commit run --all-files`）——超出预算时，跑 targeted staged-file check，并说明跳过了什么、为什么；CLI 存在时在 skip 和 opt-in 模式下跑 AI review 命令；`git status --short` 确认只改了预期文件。若工具在此处无法安装或运行（无网络、缺二进制、受限 shell），汇报 **UNVERIFIED** 并给出用户必须运行的精确命令。汇报：安装的工具、增改文件、执行命令及结果、剩余慢检查、bypass/opt-in 说明，以及状态（verified / partial / UNVERIFIED）。

## 红旗信号——一旦发现自己这样想就停下

| 念头 | 现实 |
| --- | --- |
| “这是标准 YAML，肯定能跑。” | 没执行过的 hook 会栽在路径、缺失二进制和拼写错误上。 |
| “`pre-commit` 是首选，那就把现有的换掉。” | 现有工具优先。迁移需要明确要求。 |
| “把 `make test` 放进 hook 能抓到更多 bug。” | 它也会让每次 commit 都变慢，直到大家干脆绕过 hook。 |
| “`run --all-files` 就不跑了，估计很慢。” | “估计”不是测量。跑一次并计时；只有拿预算当证据才允许跳过，并写明。 |
| “notes 目录早晚会被 ignore。” | 除了你没人会去 ignore 它——下一次 commit 它就把 diff 片段带进 history。 |

## 输出

hook 配置、脚本和失败信息遵循目标仓库的语言和约定；任何 AgentCorp 汇报 artifact 保持 zh-CN 人类可读文字，identifiers 和命令保持原样。绝不把任务 artifact 写进 skill 目录；`teamspace/` 保持本地（untracked 时加入 `.git/info/exclude`；绝不 stage、commit 或 push 它）。
