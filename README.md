# Longrein

给 Claude Code、Codex 等编程 Agent 用的一份常驻规则和一组 Skill。目标是让 Agent 能自己调查、实现和验证，同时把方向、范围和关键决定留给人。

这是自用配置，直接编辑、用软链接生效，没有安装命令。

## 内容

```text
AGENTS.md    常驻规则，每次会话都加载
skills/      按需加载的 Skill
```

**AGENTS.md** 覆盖：像 owner 一样推进任务并主动指出风险；工程取舍（第一性原理、以现有代码为基线、fail-fast、clean break）；决策记录；从工作中沉淀 Skill；subagent 的使用；工作模式（规划分 Direct / Shape，执行分 Fast / Balanced / Strict）；写注释和文档的偏好。

**Skills**

| Skill | 什么时候用 |
| --- | --- |
| `shape` | 用户要求先对齐方案时：调查现实、摆出选项和代价、逐轮问清关键决定，产出 `shape.md` |
| `test` | 测试、E2E、回归或判断能否交付：先写计划，再测到结果真正生效的地方，逐项报告 |
| `review` | 冷读改动或方案：查完影响范围，每个问题走通证据，给出结论 |
| `walkthrough` | 为没读过的人讲清一段代码、变更或设计 |
| `frontend-design` | 新建或重设计界面：从对象和数据推出结构，定视觉方向，在真实浏览器里验证 |
| `writing-notes` | 记录技术决定和放弃的方案，作为随代码更新的 ADR |
| `writing-prompts` | 手动调用：写和改 Prompt、AGENTS.md 与 Skill |

## 使用

把规则文件和 Skill 目录链接到各个宿主，例如：

```bash
ln -s "$PWD/AGENTS.md" ~/.codex/AGENTS.md
ln -s "$PWD/AGENTS.md" ~/.claude/CLAUDE.md
for s in skills/*/; do ln -s "$PWD/$s" ~/.claude/skills/; ln -s "$PWD/$s" ~/.codex/skills/; done
```

改完文件后，新会话生效。

## 工作文件

Agent 在项目里写的文件放在 `.agents/` 下：`.agents/notes/` 是决策记录，`.agents/tasks/<任务>/` 放 `shape.md`、测试计划与报告等。这些文件默认不提交。

之前基于 CLI 安装的版本见 git 历史。
