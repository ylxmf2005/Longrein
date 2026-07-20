---
name: task
description: 仅在用户显式调用 `$task`（Claude Code 中为 `/task`）时使用。开始一项新任务，或接回、查看、整理用户指定的现有 `task.md`；创建或恢复唯一任务入口，并按当前任务的真实规模展开必要工作。其他 Skill、Agent、任务复杂度或持久化需要不触发本 Skill。
---

# task

把用户明确启动的 Task 展开到所有参与者都能继续的位置。`task` 维护任务承诺、当前状态和产物入口；专业判断仍由 `shape`、`design`、`dev`、`review`、`test` 等 Skill 完成。其他 Skill 可以读取和修改当前 Active Task，但不代替用户启动或选择 Task。

## 确定当前 Active Task

一个 Session 同时只有一个 Active Task。用户给出的 task id、`task.md` 绝对路径或明确的 `new | resume` 指令拥有决定权：

- `new`：建立新任务；
- `resume <task-id|absolute-task.md-path>`：接回指定任务；
- 当前 Session 已经宣布 Active Task：沿用该绝对路径；
- 用户只输入 `$task`、又没有当前 Active Task：查找当前仓库和 `~/.longrein/studio/tasks/` 中可能相关的未完成任务，列出候选并让用户选择 resume 或 new；即使只有一个候选，也先让用户确认。

选定后，在用户可见消息中宣布 `Active Task: <task.md 的绝对路径>`。项目中存在其他 `task.md` 不代表它们属于当前工作；后续 Skill 只使用已宣布的 Active Task。新 Session 没有明确路径时，由用户再次调用 `$task` 选择，不继承“最新”目录。

## 找到任务目录

接回用户选定的 Active Task 时沿用其 `task.md` 所在目录，不另建副本。新任务使用稳定的 `<YYYYMMDD>-<slug>` 标识，并只选择一个位置：

```text
目标项目已有、未追踪且已被本地忽略的 studio/：<repo-root>/studio/tasks/<task-id>/
其他情况：                                      ~/.longrein/studio/tasks/<task-id>/
```

使用项目内 `studio/` 前运行：

```bash
git check-ignore -q studio/ || printf '\nstudio/\n' >> "$(git rev-parse --git-path info/exclude)"
```

不要修改 `.gitignore`，不要暂存或提交本地任务产物。若 `studio/` 已被追踪或产物本身需要交付，使用用户目录下的位置。

## 建立 `task.md`

创建或修订前读取 [Task Context demo](references/templates/task-context.demo.md)。把它当作完整形状参考，根据当前任务保留会改变后续判断的字段和章节；小任务可以压缩，复杂任务再展开，不为形式完整填充无关内容，也不维护平行模板。

新 Task 先创建 `status: shaping` 的 `task.md`，只记录用户原始请求、任务目录、已确认事实、关键未知和当前正在进行的 Shape；Goal、Scope 与完成条件尚未成立时明确写 `unresolved`，不填成承诺。

随后使用 `shape` 接触真实对象。Shape 深度随任务调整：清楚的小任务可以是一次短调查，不另建 `shape.md`；方向、代价或关键未知需要交接时才保存 Shape 产物。调查足以支撑承诺后，更新 Goal、Scope、Non-goals、Completion Evidence、Must Preserve 和相关 Task Operating Envelope，再按 report demo 首次向用户汇报可信 Context。

## 让用户看见任务承诺

激活 Task、第一次形成可信 Context 或后续实质变化时，读取 [Task Context report demos](references/templates/task-context-report.demo.md)。Task 启动时先报告绝对路径和 shaping/resumed 状态；Shape 尚未完成时只说明正在确认什么，不把候选写成正式承诺。可信 Context 形成后再汇报 Goal、Scope、Non-goals 与 Completion Evidence。

Context 发生实质变化时，只汇报变化量，不重复整份 `task.md`：

- 新证据改变后续判断：更新 `context_revision` 后，说明新事实、改变的判断、失效产物和下一步；
- 目标、边界、完成条件、Must Preserve、Git 意图、Task Operating Envelope 或风险接受准备变化：先用 demo 中的 Scope change proposal 取得用户决定；批准后再更新 `scope_revision` 并汇报已生效的变化；
- 仅 Current Work、Artifact Map 或执行状态变化：在正常工作更新中说明结果，不单独宣布 revision。

## 展开当前任务

根据任务真正缺少的能力确定下一步，不预设固定阶段，也不因为 demo 中出现某种产物就自动创建它：

- 方向或边界不清楚：`shape`；
- 根因、架构或实现路线仍需决定：`design`；
- 方向明确并已授权修改：`dev`；
- 需要独立压力检查：`review`；
- 需要执行证明：`test`；
- 用户需要理解现状或成果：`walkthrough`。

把已存在和下一步需要的产物写入 Artifact Map。专业细节只放在对应产物中，`task.md` 只写它们在哪里、当前是否可信、确定了什么以及下一位是谁。

## 维护权威状态

每完成、失败或阻塞一个工作单元：

1. 先更新对应产物；
2. 再更新 `task.md` 的 Current Work 和 Artifact Map；
3. 写明下一位应读取的文件和需要作出的判断。

会改变后续判断的事实变化增加 `context_revision`。目标、Scope、Non-goals、Completion Evidence、Must Preserve、Git 意图、Task Operating Envelope 或风险接受发生变化时，只能由用户改变或批准，并同时增加 `scope_revision`；标出需要重新核验的旧产物。

达到 Completion Evidence、关键产物均可检查且没有未决承重决定时，才能把状态标为 `complete`。不要创建平行的任务摘要或第二份状态文件。
