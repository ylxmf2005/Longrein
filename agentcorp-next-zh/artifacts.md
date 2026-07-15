# 交付物——共享坐标系

这里的每一条路径、每一个枚举、每一种格式都是契约，不是建议：代理、校验器、发起人的
肌肉记忆，全都依赖这些一字不差的写法。更强的模型不改动其中任何一样——它只是把这些
形态填得更好。每条规则只有一个权威落脚点：各份章程引用本文件，而不重述它。

## 任务身份与基线

- `task_id`：`<YYYYMMDD-HHMMSS>-<desc-slug>`（时间戳在前——目录列表就按时间顺序浏览）。
  任务根目录：`teamspace/tasks/<task_id>/`。
- 铸一个新任务之前，先探一探 `teamspace/tasks/`——一个正在进行、意图相同的任务，要么被
  续上、要么被显式取代，绝不悄悄复制一份。
- 每个任务在进单时、在任何交付物读取代码之前，就把它的**基线**钉进 `task.md` 的
  frontmatter：`source_ref`（这个分支从哪里切出、以之为准核验）、`target_ref`（交付合并
  进哪里）、`merge_base`。两个 ref 都是发起人出声确认过的意图，绝不从"恰好切在哪个分支
  上"里推断。任何要读、要 diff、要改代码的任务分配，都带着这三个 ref；当
  `source_ref != target_ref` 时，交付额外要求把工作重新落到 `target_ref` 上核对。基线漂移
  （任一 ref 移动了）会在任何下游阶段推进之前，重新打开受影响的那些主张。

## 任务目录布局

```text
teamspace/tasks/<task_id>/
  task.md                          # TaskRecord —— 实时执行台账
  manifest.md                      # TaskManifest —— 阶段/负责人/关卡表
  probe/00-probe.md                # 可选：地形报告
  handoffs/                        # 辅助：分配单 + 回执（因模式而异）
  requirements/validated-requirements.md
  test/
    test-plan.md                   # 总体策略；操作手册紧随其后：
    api-test-plan.md  e2e-test-plan.md  regression-test-plan.md
    test-plan-review.md
  design/                          # 按需组合；可多份并存
    architecture.md  impact-analysis.md  diagnosis.md  interface-contract.md
  implementation/
    implementation-story.md  implementation-result.md
  review/
    plan-review.md  plan-review-findings/
    code-review.md  specialist-findings/
    research/
      00-index.md                  # 每条发现一行，P0→P1→P2
      <id>-<verdict>-<slug>.md     # 每条发现一个文件——绝不打包
    fix-result.md  fix-records/<group-slug>.md
  walkthrough/<slug>.html
  verification/
    assignments/  verification-report.md  test-results/<tester-slug>.md
  acceptance/
    acceptance-package.md  acceptance-decision.md
  compound/compound-result.md
  delivery/delivery-report.md
```

任务目录之外：`teamspace/testing-context.md`（项目级、跨任务的测试台账）、
`teamspace/compound/<slug>.md`（跨任务的沉淀库）、`teamspace/skill-evolution/pending/`
（受关卡把关的自我修改提案）、`teamspace/walkthroughs/`、`teamspace/probes/`、
`teamspace/replays/`（各自独立的家，命名为 `<YYYYMMDD>-<slug>`）。

**关键 vs 辅助。** 上面除 `handoffs/`、`verification/assignments/` 和探索草稿
（`test/exploration/`）之外的一切，都是关键交付物：发起人会打开它、对它设关卡、或靠它导航
——路径与形态不变。辅助性的协调文件跟着运行时用的那套交接机制走；下面那些*保真规则*
仍然约束任何取代它们的东西。

## Frontmatter 与卫生

- 每一份 markdown 交付物都带 YAML frontmatter：`artifact_type`、`task_id`、`author_agent`、
  `status`，在血统重要之处再加 `source_artifacts:`。例外：自包含的 HTML 交付物不带
  frontmatter——由它的回执声明类型。交付物内部的路径相对于 `workdir`；绝不烧进一个
  机器专属的位置。
- `artifact_type` 的取值：`TaskRecord`、`TaskManifest`、`PhaseAssignment`、`PhaseReceipt`、
  `AcceptancePackage`、`AcceptanceDecision`、`CodeReviewDecision`、`PlanReviewDecision`、
  `TestPlanReviewDecision`、`SpecialistReviewFindingSet`、`ReviewResearchNote`、
  `ArchitectureDesign`、`ImpactAnalysis`、`Diagnosis`、`InterfaceContract`、
  `ImplementationStorySpec`、`ImplementationResult`、`FixRecordSet`、`FixResult`、`TestPlan`、
  `TestingContext`、`TestExecutionResult`、`VerificationReport`、`CompoundResult`、
  `DeliveryReport`、`ProbeReport`、`SpecialistResearchReport`、`ResearchPackage`、
  `Explanation`、`ExplanationSet`、`ChangeWalkthrough`、`ReplayReport`、
  `SkillEvolutionProposal`。
- `teamspace/` 是本地协调状态：排除在 git 之外（`.git/info/exclude`），绝不暂存、绝不提交；
  当另有一个独立的代码 worktree 时，交付物在报告完成之前先同步到两边相同的相对路径。
  任何仓库级的扫描（grep 找消费方、死代码清扫、覆盖率关卡）都排除 `teamspace/`。
- 可读的人类文字随发起人在进单时记录的语言（`output_language`）；协议字段、枚举、路径与
  代码标识符保留原文。

## 封闭词表

| 词表 | 取值（精确） |
| --- | --- |
| 人类关卡结果 | `approved` \| `skipped` \| `revised` \| `blocked` |
| 评审裁定 | `approve` \| `request_changes` \| `needs_more_evidence` \| `blocked` |
| 验收裁定 | `accept` \| `reject` \| `needs_more_evidence` \| `blocked` |
| 专项发现严重级 | `critical` \| `major` \| `minor`（唯 project-steward：`P0`–`P3`，P3 仅供参考，绝不作关卡） |
| research/fix 严重级 | `P0` \| `P1` \| `P2`（映射：critical→P0、major→P1、minor→P2、steward 的 P3→P2；每份索引里按 P0→P1→P2 排序） |
| 发现置信度 | 分档：high ≥0.80 · medium 0.60–0.79 · 低于 0.60 搁置（security 的上报下限是 0.60；一条被搁置、但若为真则严重的顾虑，给它一行 Residual-risks，绝不沉默） |
| research 裁定 | `confirmed` \| `false-positive` \| `partial` \| `needs-human` |
| research 处置 | `fix-now` \| `defer`（defer 要点名它的后续形态） |
| 需求置信度 | `HIGH` \| `MEDIUM` \| `LOW`（关卡要求 MEDIUM/HIGH） |
| 测试员结果状态 | `passed` \| `failed` \| `blocked` \| `partial`（外加逐项 `needs_more_evidence`） |
| 不可核验主张标记 | `status=unverified` —— 过不了任何关卡 |
| 交付状态 | `delivered` \| `delivered-with-risk` \| `blocked` \| `rejected` |
| 范式 | `dev/architecture-first` \| `enhancement/delta-design` \| `bugfix/hypothesis-driven` \| `addition/simple` |
| 执行策略 | `direct` \| `hybrid`（默认）\| `delegated` |
| Workflow profile | `compact` \| `standard` \| `expanded`（默认）\| `exhaustive` |
| 交互节奏 | `continuous`（默认）\| `guided` |
| 全新起步证据标记 | `VERIFIED:` \| `ACCEPTED:` \| `FAILED:` \| `UNVERIFIED:` |
| 交付物自洽状态 | `coherent` \| `needs_revision` |

## 交接保真度——两种

无论用什么机制承载一次交接，保真规则都不变：

- **独立型（评审类）**——test-plan-review、plan-review、code-review、专项评审、
  review-research、acceptance-review、verification。下游要*重新判断一次*：只传指针与
  路径，绝不传上游的结论（从众偏差）；它回传的是提炼过的结论，不是原始上下文。
- **耦合型（续作类）**——implement、fix，以及任何下游要在上游决定之上*接着建*的交接。
  喂给它完整的上游交付物及其决定，不是摘要：`fix` 携带 research 对每个问题的完整裁定
  + 根因 + 建议；`implement` 携带完整的 Story Spec 与各项契约。拿不准时，按耦合型处理。

一份回执自己说的话不算证据：先做机械校验（交付物确在指定路径、字段对得上），再做质量
判断——一项校验没过是 `needs_more_evidence`，不是关卡放行。退回绝不是原样重试：换点
东西（上下文、切分、通道）或升级上报；同一阶段连着弹回两次之后，停下重新审视计划，
而不是去做第三次重试。
