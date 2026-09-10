# Codex 推荐 Extension

本文记录一套可选的 Codex 本地工程配置，用于减少无效检索、检索历史会话，并隔离大型代码库的只读调查。它不是 Longrein 的运行前提，也不应覆盖用户已有的模型供应商、认证、插件、项目授权和个性化设置。

Longrein 自身的安装与 Skills 使用见 [安装与首次使用](getting-started.md)。本文只讨论可选的 Codex 本地效率配置。

本文组合两类能力：

| 层次 | 推荐配置 | 作用 |
| --- | --- | --- |
| Agent 编排 | `config.toml` 与只读 `explorer` | 限制并发和递归派生，把大规模检索隔离到低成本子代理 |
| 历史记忆 | `coding-agent-session-search` 与 `cass` | 检索 Codex、Claude Code、Cursor 等工具留下的本地历史会话 |

验证环境：Codex CLI `0.144.3`、cass `0.6.26`，验证日期为 2026-08-31。版本变化后应先检查命令帮助和 `codex doctor`，不要把本文中的版本敏感字段视为永久契约。

## 安装原则

- 修改前备份 `~/.codex/config.toml`、`~/.codex/AGENTS.md` 和 `~/.codex/agents/`。
- 保留已有的模型供应商、认证、插件、项目授权、通知和桌面设置，只增改本文明确列出的配置。
- 第三方项目公布的 Token 节省比例只代表其测试样本，实际收益需要通过本机任务对照验证。

## 推荐执行顺序


Longrein CLI 已把cass 上游安装与 `coding-agent-session-search` Skill 收敛成可选 Extension。普通交互安装会询问是否安装；非交互安装必须显式选择：

```bash
longrein install -y --extensions
longrein install -y --extension-components cass cass-skill
longrein extension install cass cass-skill --yes
longrein extension install --dry-run
```

交互式安装会逐项选择组件；自动化可以用 `--extension-components` 或 `extension install [components...]` 固定选择，组件名为 `cass` 和 `cass-skill`。

Longrein 不 fork cass：安装和升级仍调用上游当前公布的官方命令。以下分节保留各工具的行为、边界和人工恢复入口。

### 1. 备份现有配置

使用带时间戳的独立目录保存备份，不覆盖旧备份：

```bash
backup_dir="$HOME/.codex/backups/recommended-extension-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$backup_dir"
cp "$HOME/.codex/config.toml" "$backup_dir/config.toml"
cp "$HOME/.codex/AGENTS.md" "$backup_dir/AGENTS.md"
if [ -d "$HOME/.codex/agents" ]; then
  cp -R "$HOME/.codex/agents" "$backup_dir/agents"
fi
```

### 2. 配置 Codex 并发与探索代理

在现有 `~/.codex/config.toml` 中合并以下配置，不重建整个文件：

```toml
[agents]
# 一个主线程加最多三个并行子线程。
max_threads = 4
# 只允许主线程派生直接子线程。
max_depth = 1
```

这些字段控制容量，不负责决定何时派发子代理。派发边界仍应由 `AGENTS.md` 或具体 Skill 定义：只有相互独立、并行确有收益的工作才派发，简单任务继续由主代理完成。

在 `~/.codex/agents/explorer.toml` 配置只读探索代理：

```toml
name = "explorer"
description = "只读探索代理：用于代码库定位、资料检索、日志与测试证据收集，并向主代理返回高密度事实报告。"
model = "gpt-5.6-terra"
model_reasoning_effort = "low"
sandbox_mode = "read-only"
developer_instructions = """
你是只读探索代理。围绕主代理给出的明确问题查清事实，并交付可直接用于决策的高密度证据报告。

- 不修改文件，不执行会改变仓库、配置、服务或外部系统状态的操作。
- 不替主代理决定方案，不把事实调查扩展成未授权的实现或重构建议。
- 不派生其他代理，不管理整体工作流。
- 优先使用最窄检索范围，记录关键文件、行号、命令结果或文档来源。
- 返回结论、证据、未知项和风险，省略无价值的原始输出与过程叙述。
"""
```

如果当前账户没有 `gpt-5.6-terra`，选择可用的快速、低成本模型，但保持 `read-only` 和低推理强度的职责边界。

### 3. 安装历史会话检索

历史会话检索由两部分组成：

- `coding-agent-session-search` Skill 规定 Agent 何时检索旧会话、如何限制输出，以及怎样引用证据。
- 上游 `cass` CLI 负责发现、归一化、索引和搜索 Codex、Claude Code、Cursor、Gemini、Aider、ChatGPT 等本地会话记录。

安装上游工具时优先使用 Homebrew：

```bash
brew install dicklesworthstone/tap/cass
cass --version
```

也可以使用上游校验安装器，但自动化环境应先检查脚本或固定版本：

```bash
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/coding_agent_session_search/main/install.sh" \
  | bash -s -- --easy-mode --verify
```

我们自己的 Skill 由 Longrein 仓库中的 `longrein-extension` 插件维护，并通过宿主插件系统安装到 Codex、Claude Code 和 Pi：

```bash
longrein extension install cass-skill --yes
```

首次使用或状态未知时，不要直接运行会打开交互式 TUI 的裸 `cass`。Agent 始终从只读预检开始：

```bash
cass triage --json
```

当输出包含 `next_command` 时，先检查其影响，再按原样执行。常见的索引刷新命令是：

```bash
cass index --json --no-progress-events
```

搜索结果必须保持有界，并使用机器可读格式：

```bash
cass search "authentication redirect timeout" \
  --robot --robot-meta --limit 10 --fields summary --max-tokens 4000
```

已知工作区时，先定位最近会话，再按返回的 `source_path` 与 `line_number` 查看上下文：

```bash
cass sessions --current --json
cass view /path/to/session.jsonl -n 42 --json
cass expand /path/to/session.jsonl -n 42 -C 5 --json
```

`cass export-html` 会写入文件，只有用户明确要求导出时才使用；先用 `--dry-run --json` 确认目标，并指定 `--output-dir`，不要依赖当前目录默认值。

`cass` 默认可以使用本地词法索引。语义模型需要用户明确同意后单独下载；缺少语义模型时，词法回退仍是有效结果，不应阻塞历史检索。

两类能力的边界如下：`cass` 找回过去会话中的决定与证据，`explorer` 则把大规模只读调查隔离到独立上下文。历史会话只能作为调查入口，最终结论仍应回到当前代码、配置和运行证据核验。

## 验证

配置完成后完全退出并重新打开 Codex，再执行：

```bash
codex mcp list
codex doctor
cass --version
cass triage --json
```

预期结果：

- `config.toml` 能正常解析。
- 所选宿主已安装 Longrein Extension，并能发现其中的 `coding-agent-session-search` Skill。
- `cass triage --json` 能报告索引健康度、搜索可用性和必要的下一条命令。

验证实际收益时，使用同一仓库的同类任务比较工具调用次数、输入 Token、完成时间和结论完整性。不要只根据工具自己的 benchmark 判断是否保留。

## 回滚

历史会话检索的 Skill 与 CLI 分开卸载。插件通过宿主插件管理器移除：

```bash
codex plugin remove longrein-extension@longrein --json
claude plugin uninstall longrein-extension@longrein --scope user
brew uninstall cass
```

卸载 CLI 不自动删除本地会话源文件。`cass` 生成的索引和可选语义模型也不应作为普通卸载步骤静默清理；确需释放空间时，先用 `cass status --json` 确认数据目录和资产性质，再由用户明确决定。

需要恢复安装前的完整 Codex 配置时，从对应时间戳备份中逐项恢复。不要用一个旧 `config.toml` 直接覆盖后来新增的认证、插件、项目授权或其他有效配置。

## 暂不纳入

- Headroom 的代理、共享记忆和自动学习影响面较宽，只有真实长日志或大 JSON 仍持续污染上下文时再隔离试验。
- Caveman 主要压缩模型回复，并会增加常驻提示成本；需要短回复时使用任务级长度要求，不改变全局沟通质量。
