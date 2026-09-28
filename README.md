<div align="center">

# Longrein

**让编程 Agent 自己推进工作，把方向、范围和关键决定留给人。**

一份常驻规则和 7 个 Skill，适用于 Claude Code、Codex，以及其他支持 `AGENTS.md` 和 Agent Skills 格式的 Agent。全部内容用中文编写。

[快速开始](#快速开始) · [包含什么](#包含什么) · [使用](#使用) · [工作文件](#工作文件)

</div>

## 设计取向

- **常驻规则少而通用。** 每次会话都加载的 `AGENTS.md` 只放每个任务都用得上的判断；只有某类任务才需要的流程放进 Skill，触发时才加载。规则写目标、边界和判断标准，具体怎么做留给模型。
- **Agent 自己推进，人做关键决定。** 默认由 Agent 调查、实现并验证到目标真正达成，只在不可逆的操作和需要人裁决的决定前停下。想先对齐方案时，由你主动进入 Shape。
- **验证看证据。** 测试从真实入口走到结果真正生效的地方，评审里的每个问题都先试着推翻再报告。交付时说明验证了什么、还有什么没有证明。
- **经验留得下来。** 技术决定写成随代码更新的决策记录，工作中摸清的做法写回 Skill，下一次会话能直接用上。

## 快速开始

```bash
git clone https://github.com/ylxmf2005/Longrein.git ~/Longrein
cd ~/Longrein
```

用软链接接入宿主，之后 `git pull` 拿到的更新在新会话里生效。

**Claude Code**

```bash
ln -s "$PWD/AGENTS.md" ~/.claude/CLAUDE.md
mkdir -p ~/.claude/skills
for s in skills/*/; do ln -s "$PWD/${s%/}" ~/.claude/skills/; done
```

**Codex**

```bash
ln -s "$PWD/AGENTS.md" ~/.codex/AGENTS.md
mkdir -p ~/.codex/skills
for s in skills/*/; do ln -s "$PWD/${s%/}" ~/.codex/skills/; done
```

其他宿主按同样方式链接到它们读取规则和 Skill 的位置，例如 Pi 的 `~/.pi/agent/AGENTS.md` 和 `~/.pi/agent/skills/`。

接入前注意几点：

- `ln -s` 不会覆盖已有文件。已经有自己的 `CLAUDE.md` 或 `AGENTS.md` 时，先备份，或者把需要的部分合并进去。
- `AGENTS.md` 里有两处是作者自己的环境：「Skill 与 Subagent」一节的模型映射，和「其他偏好」里的 worktree 路径。换成你自己的，或者删掉。
- 只想用 Skill 的话，跳过链接 `AGENTS.md` 那一行即可。
- Claude Code 的官方插件里也有一个 `frontend-design`，和这里的同名 Skill 同时启用会一起触发，建议只留一个。

## 包含什么

```text
AGENTS.md                      常驻规则，每次会话都加载
skills/<name>/SKILL.md         Skill 正文，frontmatter 里的 description 决定什么时候触发
skills/<name>/references/      只在需要时才读的补充材料
skills/<name>/agents/openai.yaml   Codex 使用的显示名和调用策略
```

### AGENTS.md

| 章节 | 内容 |
| --- | --- |
| Owner 意识 | 把任务推进到目标真正达成，主动指出你可能没意识到的风险，交付时说明改了什么、怎样验证 |
| 工作模式 | 规划分 Direct（Agent 做决定）和 Shape（你做决定），执行分 Fast、Balanced、Strict，验证投入随改动的规模和风险增加 |
| 工程取舍 | 回到根因，以现有代码的惯例为基线，失败要显式，切换设计时不让新旧机制并存 |
| Skill 与 Subagent | 你的指令优先于 Skill；什么时候委派给 subagent，按任务难度选模型 |
| 决策记录 | 改模块前先读相关的决策记录，做出重要决定时写一条 |
| 沉淀经验 | 把工作中摸清的做法写成或补进 Skill，下次不用重新摸索 |
| 其他偏好 | 讲解概念、写文档和注释、保护工作树中已有的修改 |

### Skills

| Skill | 什么时候用 | 产出 |
| --- | --- | --- |
| [`shape`](skills/shape/SKILL.md) | 想先对齐方案、由自己做关键决定再动手 | `shape.md`：目标、范围、验收标准、你做出的决定和实现方案 |
| [`test`](skills/test/SKILL.md) | 测试、回归、复现缺陷，或判断能不能交付 | 先写测试计划，执行后逐项报告通过、失败或未完成 |
| [`review`](skills/review/SKILL.md) | 判断一个改动、PR、设计或方案能不能合并、交付 | 按严重程度排序的问题，和「可以合并 / 需要修改 / 需要你决定」的结论 |
| [`walkthrough`](skills/walkthrough/SKILL.md) | 想弄懂一段代码、diff、设计或一次故障 | 沿调用、数据和状态讲清来龙去脉，附依据和没覆盖的部分 |
| [`frontend-design`](skills/frontend-design/SKILL.md) | 新建、重设计或明显打磨页面和组件 | 可运行的界面，在真实浏览器里用真实数据检查过桌面和移动端 |
| [`writing-notes`](skills/writing-notes/SKILL.md) | 做了以后会被问「为什么这样改」的技术决定 | 随代码更新的决策记录（ADR） |
| [`writing-prompts`](skills/writing-prompts/SKILL.md) | 写、改写或审查 Prompt、`AGENTS.md` 和 Skill，只能手动调用 | 改写后的文本和关键改动的理由 |

## 使用

多数时候不用点名，正常描述任务，Agent 会按 Skill 的 description 自己选。需要指定时：

| 宿主 | 写法 |
| --- | --- |
| Claude Code | `/shape <你的需求>` |
| Codex | `$shape <你的需求>` |
| Pi | `/skill:shape <你的需求>` |

Shape 和 Strict 只在你提出时使用，Agent 不会自己进入，最多建议你用。例如 `/shape 给导出功能加权限控制`，或者在需求里写一句「这次用 Strict」。

`shape` 支持三个互斥的参数，用来在收敛前多看几种方案：

| 参数 | 作用 |
| --- | --- |
| `--ponytail` | 多给一个最小可行的方案 |
| `--bold` | 多给一个有证据支撑的扩展方案 |
| `--contrast` | 两种视角各自独立调查，再综合比较 |

`walkthrough` 加 `--learn` 时，会从当前代码里的例子出发，多讲一个以后遇到类似问题也用得上的概念。

## 工作文件

Agent 在项目里写的文件都放在 `.agents/` 下：

```text
.agents/notes/<日期>-<主题>.md    决策记录，修改相关模块前先读
.agents/tasks/<日期>-<主题>/      一次任务的产物：shape.md、test.md 和 evidence/、review.md、walkthrough.md
```

这些文件默认不提交。可以把 `.agents/` 加进项目的 `.gitignore`；需要把某条决策记录纳入版本库时，让 Agent 和对应的代码一起提交。

## 修改

规则和 Skill 都是普通的 Markdown，直接改文件即可，新会话生效。改之前可以先用 `/writing-prompts` 审一遍改动，它会从模型怎样读这些文字的角度，指出哪些话在起作用、哪些在稀释重点。

问题和建议欢迎提到 [GitHub Issues](https://github.com/ylxmf2005/Longrein/issues)。

## License

MIT
