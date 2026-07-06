# 设计:把 learnings 重设计成交付前的 `compound`(沉淀)阶段

状态:草案,待 sponsor 评审
日期:2026-06-24
作者:与 sponsor 协作(brainstorming)

## 1. 背景与目标

今天 AgentCorp 有一套 `teamspace/learnings/` 机制("每完成一件事都让下一件更容易"),但它**几乎从不触发**。病因有三:

1. **它不是一个阶段。** capture 被定义成"orchestrator 的家务,三种模式下静默做",不在任何 paradigm 的 phase 列表里,没有任何结构让它发生。
2. **触发是一句劝告。** "交付收尾时想想有没有值得记的",门槛主观,模型默认答"没有"。
3. **它是隐形的。** 不是 gate、静默做,没有强制点、做没做看不见。

参考 compound engineering(Every / Kieran Klaassen)的框架 **plan → work → review → compound**:"compound"是第四个一等步骤,产出的不是被动笔记,而是会改变以后行为的东西——"每个 bug 变成一个测试,每个决定变成一条规则,每次评审变成一道检查"。

**目标**:把"learnings"从"参考文件里的静默劝告 + 被动笔记",升级成一个**排在交付前、模型自然会走到、产出会自动生效资产**的阶段。

## 2. 核心决定(已与 sponsor 确认)

- **名字**:phase 英文名 `compound`,中文 **沉淀**。(作为一个动作 phase,区别于之前被否的"复利/compounding"名词叫法。)
- **定位**:每条 paradigm 里的一个 phase,排在 `acceptance-review` 之后、`deliver` 之前。
- **软 phase,不是硬闸**:它在 phase 列表里(结构上的显著存在 = "模型要知道"),照常产出产物、在对话里说出来;但 `deliver` **不会**因为它单薄而被 `validate-handoff` 硬卡。详见 §4。
- **产出三种会自动生效的资产**(option 2):
  1. bug → 回归测试 → 目标仓测试套件;
  2. 决定/坑 → 规则 → 目标仓 `CLAUDE.md` / `AGENTS.md`;
  3. 确认的、可复用的评审发现 → reviewer 触发清单 → **回写 AgentCorp 自己,但走"提案 → sponsor 批 → 才落",不静默自动改**。
- **按任务规模缩放**:一行改的小活,compound 就是一句"没什么可沉淀的",不折腾。

## 3. 这个 phase 怎么工作

### 3.1 位置与归属

- 位置:`… → verify → acceptance-review → compound → deliver`,四条 paradigm 全部加入。
- 归属:Delivery Orchestrator 拥有(和 `deliver`、`validate-requirements` 一样由 orchestrator 亲自做),**不新增独立 skill**,保持薄。作为 orchestrator 亲自做的 phase,它和 `deliver`/`validate-requirements` 一样**不走 assignment/receipt**,但仍要写 `manifest.md` 条目(便于"做没做"可见)。

### 3.2 三个产出(active assets)

| 资产 | 由什么触发 | 落到哪 | 自动程度 |
| --- | --- | --- | --- |
| 回归测试 | 本单修复/复现过的 bug | 目标仓测试套件(接 `regression-tester`) | 直接落(本就是交付物该带的) |
| 规则/约定 | 本单发现的仓库陷阱或定下的约定 | 目标仓 `CLAUDE.md` / `AGENTS.md` | 直接落 |
| reviewer 触发清单条目 | 本单确认的、可复用的评审发现模式 | AgentCorp 自己的 reviewer 技能(接第 05 条"触发短语清单") | **提案 → sponsor 批 → 才落** |

第 3 种是 AgentCorp 自我修改,撞上护栏"人拥有 skill 修改权"。因此它只写成提案,在 `deliver` 时点名给 sponsor;sponsor 同意后才真正改 reviewer 技能文件。

### 3.3 两个配套触点(不全压在这一个 phase 上)

- **开头(intake / validate-requirements)的"反向取用"**:按任务关键词 grep 已沉淀的知识,读 frontmatter 判相关性,把相关条目作为 **path + 一行摘要** 喂进下游 assignment。这是今天 learnings 就该有的"reflux",一并修好。
- **中途的 event-driven 随手记**:在 `diagnose`、`review-research` 等过程里,当一个可沉淀的时刻发生(诊断出反直觉根因、推翻一批假阳性、踩到仓库陷阱),**当场记一笔**轻量笔记;`compound` phase 再把这些零碎**收拢**成 §3.2 的三种资产。`fresh-start-handoff` 里现成的 `FAILED:` 标记是这种随手记的一种来源(接第 03 条:失败路记忆)。

### 3.4 按规模缩放

- 琐碎/一行改:`compound` 产出一行"无可沉淀",`deliver` 照常。
- 中大型或 bugfix:正常产出资产。
- 这条守住护栏"别给一行改压上重流程"。

## 4. "被知道、但不被强制"的确切含义

这是本设计最关键、也最容易做歪的一点。

- **被知道 = 它在 phase 列表里。** orchestrator 一路按 phase 序列走下来,自然轮到 `compound`,不靠埋在参考文件里的提醒。这就是 sponsor 说的"模型要知道"。
- **不被强制 = 没有硬闸。** `validate-handoff.py` **不**因为缺 compound 产物而判 `deliver` 失败。理由:硬闸会逼出"为过关而写的垃圾沉淀",变成 theater,正是 AgentCorp 反对的。
- **可见、但不阻断。** `compound` 的结果写进 `delivery-report.md` 的一节,并在对话里用一句话说出来("本轮沉淀:加了 1 条回归测试、给目标仓 CLAUDE.md 加了 1 条规则、给 correctness-reviewer 提了 1 条触发词建议待你确认")。跳过是可见的(报告里那节会空),但不被 police。

对照今天的失败(隐形 + 劝告):新设计是 **在列表里(自然轮到) + 绑在发生的时刻(event-driven) + 说出来(可见)**,三者一起把"从不触发"扭过来,而不靠一道闸。

## 5. 数据 / 产物结构

- **per-task 产物**:`teamspace/tasks/<task_id>/compound/compound-result.md`,`artifact_type: CompoundResult`,`author_agent: delivery-orchestrator`。记本轮:加了哪些回归测试、写了哪些目标仓规则、提了哪些 reviewer 触发词提案(或"无可沉淀")。
- **跨任务持久库**:`teamspace/compound/<slug>.md`(取代今天的 `teamspace/learnings/`)。每条一个文件,greppable frontmatter(沿用今天的 `slug/date/task_id/type/applies_when/tags`,`type` 增补 `failed-approach`)。这是 §3.3 "反向取用"读的东西。
- **sync**:与其它 `teamspace/` 产物一样,Workspace 与 Location 双边同步;`teamspace/` 仍只在本地、加进 `.git/info/exclude`,不提交。

## 6. 跟现有机制的衔接

- **regression-tester**:回归测试资产的落地复用它,不另起炉灶。
- **第 05 条(触发短语清单)**:reviewer 触发清单条目就是往那条机制里加料;compound 是它的"自动续供"来源。
- **第 03 条(失败路记忆)**:`failed-approach` 类型 + event-driven 随手记 + `fresh-start-handoff` 的 `FAILED:` 标记,都收进这套;第 03 条被本设计**吸收**,不再单独做。
- **fresh-start-handoff**:它在重启前"先把本轮 lessons 写回"的动作,改为写回新的 `teamspace/compound/` 持久库。

## 7. 要改的文件(实现阶段清单,en + zh 双份)

1. `delivery-orchestrator/references/workflow.md`:
   - 四条 paradigm 的 phase 列表各加 `compound`(在 `acceptance-review` 与 `deliver` 之间);
   - Phase Catalog 加一行 `compound`(owner、inputs、outputs、**软** quality gate 描述);
   - 把 "Learnings" 一节重写为 "Compound(沉淀)",含:phase 定位、三种产出、intake 反向取用、event-driven 随手记、按规模缩放、"被知道不被强制"的说明;
   - Stage Owners 补 `compound` 归 orchestrator;
   - 运行时布局加 `teamspace/compound/` 与 `tasks/<id>/compound/`。
2. `delivery-orchestrator/references/learnings.md` → 重写并改名为 `compound.md`:bar / shape / dedup / reflux 保留,新增"产出 active assets"与"第 3 种走提案"的规则,`type` 增补 `failed-approach`。
3. 新增 demo:`delivery-orchestrator/references/templates/compound-result.demo.md`。
4. `delivery-orchestrator/SKILL.md`:把 learnings 相关提及改为 compound。
5. `agentcorp-zh/` 对应五处全部镜像(中文按已定的反 AI 腔 / 不绝对化贬低红线)。
6. 工具核对:`tools/validate-skills.py`(确认仍过)、必要时 `scripts/validate-handoff.py` 认 `CompoundResult` 这个 `artifact_type`(但**不**为它加硬闸)。

## 8. 边界与护栏

- 不立硬闸、不卡 deliver(§4)。
- 第 3 种(回写 AgentCorp 自己)只提案、人批后落;守"人拥有 skill 修改权"。
- 不把 `compound.md` 的内容回灌进薄 SKILL.md;细节留在 references。
- 按任务规模缩放,小活不折腾。
- en / zh 双份同步。

## 9. 待 sponsor 在评审时确认的小项

- 持久库目录名 `teamspace/compound/`(per-task 产物也在 `compound/` 下,二者同名但层级不同)——是否 OK,还是持久库换个名以免混淆。
- `compound` 在 `acceptance-review` 被 `reject` 时是否仍跑:本设计建议**只在走到 deliver 的路径上跑**;reject/rework 路径上的沉淀由 §3.3 的 event-driven 随手记覆盖(尤其 `failed-approach`)。
