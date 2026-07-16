# AgentCorp

AgentCorp 是一组面向强模型的通用协作 Skills。它不把 Agent 固定成一条流水线，而是让模型根据真实任务选择合适能力：方向不可靠时先调查，结构尚未成立时先设计，需要代码时负责实现，完成声明则必须经过独立评审、真实测试和可检查证据。

这套 Skills 共同保护四件事：现实高于最初描述；用户保留价值判断与授权；模型拥有调查和实现路径的空间；新证据可以修订计划、结论和长期规则。

## Skills

| Skill | 作用 |
|---|---|
| `soul` | 贯穿任务的工程态度：面对现实、承担长期成本，不制造额外流程。 |
| `shape` | 调查真实情况，挑战错误方向，形成值得承诺的目标与边界。 |
| `prompt` | 从实际协作偏差中帮助用户改进提示词，不在真空中润色。 |
| `rewind` | 当前时间线被错误前提污染时，保留可靠资产并回到可信位置。 |
| `design` | 形成可修订的架构、契约、影响分析和实现路线。 |
| `dev` | 实现功能、修复缺陷和落实已确认问题，交付最小诚实改动。 |
| `review` | 独立冷读需求、设计、代码和交付物，以因果证据确认问题。 |
| `test` | 制定 TestPlan、执行真实测试并交付可重放的 Test Report。 |
| `walkthrough` | 把人带回能够理解对象、检查证据并继续作出判断的位置。 |
| `evolution` | 从真实失败和摩擦中提炼经验，并在人工批准后改进长期能力。 |

Skills 会根据任务自然组合，但不会为了流程完整而全部触发。简单任务保持简单；只有真实风险、未知和证据要求才增加相应能力。

## 仓库结构

```text
AgentCorp/
├── agentcorp/                  # 唯一权威 Skill 目录
│   └── <skill>/
│       ├── SKILL.md
│       ├── references/         # 按需加载的知识与详细协议
│       ├── scripts/            # 需要确定性执行时使用
│       └── assets/             # 产物需要复用的资源
├── skills -> agentcorp         # Codex / Claude 插件入口
├── references/                 # 仓库级研究材料，不随每次 Skill 调用加载
├── .codex-plugin/plugin.json
├── .claude-plugin/plugin.json
└── .agents/plugins/marketplace.json
```

新增 Skill 时，只需创建：

```text
agentcorp/<skill-name>/SKILL.md
```

本机的同步服务会把 `agentcorp/` 下每个 Skill 分别链接到：

```text
~/.codex/skills/<skill-name>
~/.claude/skills/<skill-name>
```

因此新增、删除或改名 Skill 后，无需手工维护两份目录。需要立即同步时运行：

```bash
~/.skills-sync/reconcile-skill-symlinks.sh
```

同步完成后开启新会话，让 Codex 或 Claude Code 重新发现 Skills。Codex 中可以使用 `$shape`，Claude Code 中可以使用 `/shape`；模型也会根据各 Skill 的 `description` 自动触发。

## 插件形式

仓库同时保留 Codex 与 Claude Code 插件元数据，便于整体分发。插件模式使用 `agentcorp:<skill-name>` 命名空间；本机开发默认使用上面的逐 Skill 链接，不同时安装插件，避免同一能力重复出现。

Codex：

```bash
codex plugin marketplace add /absolute/path/to/AgentCorp
codex plugin add agentcorp@agentcorp
```

Claude Code：

```bash
claude --plugin-dir /absolute/path/to/AgentCorp
```

## 修改与验证

Skill 是跨用户、跨项目的长期能力。当前任务事实留在任务或项目中；用户个人偏好留在用户资料中；只有能够跨任务重放的行为问题才进入通用 Skill。

修改 Skill 后至少运行：

```bash
python3 /Users/ethan/.codex/skills/.system/skill-creator/scripts/quick_validate.py agentcorp/<skill-name>
```

文字变化本身不等于能力改善。重要修改应使用相同任务做前后对照，并检查正确性、完整性、用户介入、意外动作、成本和长上下文副作用。
