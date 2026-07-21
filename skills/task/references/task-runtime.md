# Task Runtime

Task Runtime 是 Active Task 核心状态的唯一写入者。它不依赖 Hook，也不观察每次工具调用；它通过明确的工作单元边界、仓库快照、产物 hash 和完成门禁，让 `task.md`、`timeline.md` 与真实工作保持可检查的一致。

## 文件所有权

```text
<task-workspace>/
├── task.md              # Runtime 生成的当前用户视图
├── timeline.md          # Runtime 生成的任务历史
├── .runtime/
│   └── state.json       # 核心机器状态与事件；只有 Runtime 修改
└── <专业产物>            # Shape、Dev、Review、Test 等各自拥有
```

`.runtime/state.json` 是核心状态源。`task.md` 和 `timeline.md` 是它的投影视图，不能直接编辑。`longrein task doctor --fix` 只会重新生成两个视图；它不会把手工编辑、未知代码变化或产物漂移自动承认为有效状态。

专业产物不是 Runtime 生成物。对应 Skill 先修订自己拥有的代码或产物，再用 Task Command 登记产物状态、发现、工作结果或验证证据。

Runtime 不迁移旧式 Task。目录缺少 `.runtime/state.json` 时不能 resume；如果目标仍需继续，创建新的 Runtime Task 并重新建立可信 Context。

`task create` 也不会覆盖目录中已经存在的 `task.md`、`timeline.md` 或 `.runtime/state.json`，因此新 Task 必须使用新的 workspace。

## 为什么不用 Hook

Longrein 不要求安装或信任生命周期 Hook。更新协议只依赖显式边界：

1. 工作开始前登记 Now，并保存当前仓库快照；
2. 工作完成或阻塞时登记结果，并与开始快照比较；
3. 专业产物发布时保存内容 hash；
4. 交接和完成前运行 doctor；
5. 有未解释的仓库变化、产物漂移、生成视图漂移或未通过的完成证据时，完成门禁拒绝关闭 Task。

这不承诺实时捕获 Agent 没有表达的内部想法，也不把普通读文件、搜索和命令写入 Timeline。它保证的是：Task 在明确交接或完成边界上不能把未同步变化包装成可信状态。

## 命令协议

新建 Task：

```bash
longrein task create <task-dir> \
  --id <task-id> \
  --request "<用户原始请求>" \
  --repository <repo-root>
```

首次建立或后续修订 Task Context：

```bash
longrein task context <task.md> \
  --summary "<本次 Context 变化>" \
  --goal "[UD-001] ..." \
  --scope "[UD-002] ..." \
  --non-goal "[UD-003] ..." \
  --completion "<可检查完成证据>" \
  --preserve "[UD-004] ..." \
  --next "<下一项工作>"
```

Goal、Scope、Non-goals、Completion Evidence、Must Preserve 或 Git 意图首次建立后，再次修改必须带 `--decision UD-###`；Runtime 随后增加 `scope_revision`。事实、假设或 Operating Envelope 变化增加 `context_revision`。首次可信 Context 可以在 shaping 阶段已经记录 finding 之后建立，不需要伪造“替换旧承诺”的决定。

每个可交接的工作单元使用：

```bash
longrein task work start <task.md> --now "<当前动作>" --next "<预期下一步>"
longrein task work finish <task.md> --result "<实际结果>" --next "<下一步>"
longrein task work block <task.md> --reason "<阻塞原因>" --waiting-on "<等待对象>"
```

`work finish` 和 `work block` 都要求已经存在活动工作单元。它们会结束该工作单元并把当前仓库快照记为已解释边界；没有先 start 的变化不能借 block 静默认领。

其他状态入口：

```bash
longrein task finding <task.md> --summary "<改变后续判断的发现>" --evidence-ref <path>
longrein task artifact <task.md> --path <path> --status ready \
  --establishes "<它确定了什么>" --next-consumer <skill-or-person>
longrein task evidence <task.md> CE-001 --status passed --proof "<证明摘要>" \
  --evidence-ref <path>
longrein task show <task.md>
longrein task doctor <task.md>
longrein task doctor <task.md> --fix
longrein task complete <task.md> --summary "<完成结果>"
```

`--evidence-ref` 可以重复。需要记录实际参与者时使用 `--actor`；否则 Runtime 记录为 `agent`。

## 状态与专业能力分离

Task 生命周期使用：

```text
shaping → ready → working → verifying → complete
                    ↘ waiting | blocked
```

`abandoned` 和 `superseded` 是保留终态。Shape、Dev、Review、Test 等是当前工作单元使用的专业能力，不是 Task 生命周期；Runtime 不要求所有 Task 经过固定 Skill 阶段。

## 漂移与恢复

`longrein task doctor` 检查：

- `.runtime/state.json` 是否可读且属于当前 workspace；
- `latest_event` 是否指向最后一个 Timeline 事件；
- `task.md` 与 `timeline.md` 是否和 Runtime 状态一致；
- active、ready、verified 产物是否存在且 hash 未漂移；
- 配置了 repository 时，Git 工作树是否可读，且是否在最近一次工作单元边界后出现未解释变化；
- 已完成 Task 是否仍满足完成证据。

只有生成视图漂移时使用 `doctor --fix`。产物或仓库漂移必须回到真实对象，完成修改后重新登记对应工作单元和产物。

## 完成门禁

`longrein task complete` 至少检查：

- Task 已建立包含 Goal、Scope 和 Completion Evidence 的可信 Context；
- 当前状态是 `ready` 或 `verifying`，没有活动、waiting 或 blocked 工作单元；
- 至少有一项 Completion Evidence，且每一项都是 `passed`；
- `task.md` 和 `timeline.md` 与 Runtime 状态一致；
- active、ready、verified 产物存在且 hash 没有漂移；
- 配置了 repository 时，Git 工作树可读，且最近一次已登记工作单元之后没有新的未解释变化。

门禁失败时，修订真正的专业产物或补充缺失的 Task Command。不要用 `doctor --fix` 掩盖语义、代码或证据缺口。
