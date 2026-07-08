# 本地实现参考

SKILL.md 承载这个角色的规则；这份文件承载工作纪律——如何走一遍 Story Spec、让 diff 保持小的 gates，以及 handoff 给 Code Review 之前必须通过的 gate。

## 执行 Story Spec

首先通读整个 Story Spec，消化其中的 Story、Acceptance Criteria、Tasks/Subtasks、Implementation Constraints、Verification Expectations、Review Focus 和 Status，然后加载它引用的代码和项目上下文。接着按顺序完成 tasks/subtasks——除非 Story Spec 或 reviewer 明确允许重新排序。

对每个 task 做"最小且正确"的改动：紧贴已批准的 story 实现，不要顺带塞入周边优化；保持现有模块边界不变，除非已批准的 artifact 明确要求修改。尽量让每个文件只包含单一连贯的改动，并且在再次修改前重新读一遍。当 behavior、contract、bug、data、auth 或 public interface 发生变化时，添加或更新针对性测试。在推进过程中，把 progress、changed files、commands、deviations 和 blockers 记录到 `implementation/implementation-result.md`——边干边写，不要到最后凭记忆补。

## Diff 最小化 gates

改动越少越好。在添加任何内容之前，先用以下问题 gate 一下，防止 diff 膨胀：

- **先复用，再新建。** 在添加函数、文件或抽象之前，先在仓库里搜一下是否已有现成实现（grep 关键符号、相似名称、同类工具）——能复用就复用，不要在旁边再立一个平行副本。
- **不为想象的未来做泛化。** 不要预留 flag/option/plugin point，也不要写通用结构来应对"以后可能会用到"；如果眼下只有一个 use case，就按这一个 case 写。
- **不提前抽取。** 单调用方的逻辑直接内联写；不要抽成共享函数，除非已批准的 Story Spec 明确要求该接口。
- **不顺手碰无关代码。** 任务没要求改的现有代码保持原样——不要把顺带的重命名、重构和格式化塞进这次改动。
- **每个新增都追溯到 spec。** 每项新增的能力、文件或分支都应能追溯到 Story Spec 或 acceptance criteria；追溯不到的即 out of scope，不要做。

## Handoff 前的 gate

在 handoff 给 Code Review 之前，逐项确认——这份列表的末尾几项正是 Code Review Lead 和 review-researcher 验证这次改动所需要的，也是最常被跳过的部分：

- 每个必需的 task/subtask 要么已完成，要么被明确列为 blocked。
- 代码能编译通过，相关 static checks（如有）通过。
- 针对性测试通过，或者失败被如实记录为 blocker。
- 结果行为已对照 acceptance criteria、TestPlan 或 diagnosis criteria 检查过。
- implementation result 列出了每一个新增、修改和删除的文件，以及每一处偏离已批准 Story Spec 的地方。
- Code Review Lead 能够拿到变更文件、命令、测试证据和已知风险——每一项都是可检查的 handle（命令 + 输出、file:line），而不是状态词。
