# 产物一览：完整运行时布局

[← 返回 README](../README_CN.md) · [English](artifacts.md)

每个阶段都会留下结构清晰的产物，全部带 frontmatter（`artifact_type` / `author_agent` / `phase` / `status` / `source_artifacts`），可审计、可回溯。不是每个任务都会生成下面每一个文件；这里展示的是完整运行时布局，AgentCorp 会按任务实际需要创建对应阶段、评审、测试、研究包和交接记录。

```
teamspace/
├── testing-context.md                    # 跨任务运行时事实：入口、登录、页面、可观测面、测试数据约定
├── compound/                             # 跨任务沉淀库：每条一文件、写前去重，含试过不行的路(failed-approach)
│   └── invite-token-reuse-trap.md        #   触发情境 -> 根因 -> 怎么做 -> 下次如何更快
├── knowledge/                            # 可复用研究快照：从任务研究中筛选出值得跨任务保留的材料
│   └── <technology>/INDEX.md
├── probes/                               # 独立地形报告：在任何任务存在之前写下
│   └── 20260620-billing-module.md
├── walkthroughs/                         # 任务之外的独立变更 walkthrough（自包含 HTML）
└── tasks/20260622-invite-members/        # 本次任务根目录
    ├── task.md                           # 任务记录：请求、成功标准、阶段序列、门禁历史、决策日志
    ├── manifest.md                       # 审计台账：阶段、Owner、状态、人工门、质量门、分派单、产物、回执
    │
    ├── probe/                            # 可选：进入需求前的地形报告，附持续更新的未知项台账
    │   └── 00-probe.md
    │
    ├── handoffs/                         # 委派阶段的分派单/回执闭环
    │   ├── 001-validate-requirements.md
    │   ├── 001-validate-requirements-receipt.md
    │   ├── 002-test-plan.md
    │   ├── 002-test-plan-receipt.md
    │   └── ...
    │
    ├── requirements/
    │   └── validated-requirements.md     # 意图、用户、旅程、FR/AC、非目标、约束、假设、开放问题
    │
    ├── design/                           # 按需生成；多个设计产物可以并存
    │   ├── architecture.md               # 新系统/子系统架构：组件、数据/状态流、接口、取舍
    │   ├── impact-analysis.md            # 增量设计：受影响模块、当前/目标行为、风险、需保留行为
    │   ├── diagnosis.md                  # Bug 诊断：复现、假设、根因、建议修复、回归标准
    │   └── interface-contract.md         # 公共/共享契约：schema、认证、错误、兼容性、验证钩子
    │
    ├── test/
    │   ├── test-plan.md                  # 风险排序的总策略、必测层级、显式缺口、禁区
    │   ├── api-test-plan.md              # API/集成手册：字面请求、预期响应、证据处理
    │   ├── e2e-test-plan.md              # E2E 手册：浏览器步骤、字面输入、截图/URL 证据
    │   ├── regression-test-plan.md       # 回归手册：爆炸半径、既有套件、修前失败/修后通过检查
    │   ├── test-plan-review.md           # 测试计划独立评审：approve / request_changes / needs_more_evidence
    │   └── exploration/                  # 补全 testing-context.md 的工作文件；确认事实回写上下文
    │       ├── charters.md               # 探索章程与状态
    │       ├── frontier.md               # 待探索入口点及来源
    │       └── journal.md                # 逐步操作、观察、截图、阻塞
    │
    ├── implementation/
    │   ├── implementation-story.md       # 实现故事：范围 AC、任务顺序、目标模块、约束、验证期望
    │   └── implementation-result.md      # 实际实现结果：改动文件、命令、偏差、阻塞、移交评审
    │
    ├── review/
    │   ├── plan-review.md                # Plan Review Lead 对 Story Spec 的决策
    │   ├── plan-review-findings/         # plan-review 专项发现(与 code-review 的目录分开)
    │   ├── code-review.md                # Code Review Lead 汇总决策
    │   ├── specialist-findings/          # 专项评审发现；只有被调用的 reviewer 会写文件
    │   │   ├── correctness-reviewer.md
    │   │   ├── security-reviewer.md
    │   │   ├── performance-reviewer.md
    │   │   ├── reliability-reviewer.md
    │   │   ├── simplicity-reviewer.md
    │   │   ├── taste-reviewer.md
    │   │   ├── change-hygiene-reviewer.md
    │   │   ├── standards-reviewer.md
    │   │   ├── comment-optimizer.md
    │   │   ├── project-steward-reviewer.md
    │   │   ├── api-contract-reviewer.md
    │   │   ├── adversarial-reviewer.md
    │   │   └── parallel-researcher.md    # desk / source-verified 级研究(案头核证)作为专项证据时使用
    │   ├── research/                     # 评审复核：每个 finding 都当作可能误报重新验证
    │   │   ├── 00-index.md               # 汇总所有 per-issue research 文件的索引
    │   │   ├── 001-confirmed-...md       # 每问题一文件：verdict、证据、根因、修复建议
    │   │   └── 002-false-positive-...md  # 误报或需要人工确认的记录
    │   ├── fix-records/                  # 每个互不重叠文件组一份 Review Fixer 记录
    │   │   └── invite-service.md         # item 处置、改动文件、验证、漂移检查
    │   └── fix-result.md                 # Orchestrator 汇总所有修复组和合并验证
    │
    ├── research/                         # 动手研究包：需要实验或资料快照时生成
    │   └── invite-email-provider/
    │       ├── 00-report.md
    │       ├── env/
    │       ├── sources/
    │       └── experiments/
    │
    ├── explain/                          # 按需落库的白话解释，方便 sponsor 逐项阅读
    │   └── review-summary/
    │       ├── 00-index.md
    │       └── 001-finding-context.md
    │
    ├── walkthrough/                      # 可选：本次变更的教学产物，背景 → 直觉 → story → 测验
    │   └── invite-flow.html
    │
    ├── verification/
    │   ├── assignments/                  # Test Leader 在委派验证时写给各 tester 的分派单
    │   │   ├── e2e-tester.md
    │   │   ├── api-contract-tester.md
    │   │   └── regression-tester.md
    │   ├── test-results/                 # 真实执行证据，不臆造成功
    │   │   ├── e2e-tester.md             # 状态、已检查流程、命令、截图/URL 证据
    │   │   ├── api-contract-tester.md    # 请求/响应、通过/失败、schema/contract 证据
    │   │   └── regression-tester.md      # 前后对比、命令、退出码
    │   └── verification-report.md        # Test Leader 总裁决，引用 result 文件和剩余缺口
    │
    ├── acceptance/
    │   ├── acceptance-package.md         # Orchestrator 验收包：成功标准、产物索引、直接证据、缺口
    │   └── acceptance-decision.md        # Acceptance Review Lead 裁决：accept / reject / needs_more_evidence
    │
    ├── compound/
    │   └── compound-result.md            # 沉淀 phase 产出：落了哪些回归测试、写了哪些规则、提了哪些提案
    │
    └── delivery/
        └── delivery-report.md            # 最终交付报告：状态、代码/产物位置、测试、风险、后续项
```
