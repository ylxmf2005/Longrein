# Review 产物 Demo

这份文件是 `review/review.md` 的唯一结构来源。根据对象风险压缩表达：低风险小对象可以合并没有问题项的章节或用一行说明 `none`，但审查结论、审查边界、type coverage、证据缺口和剩余风险不能静默省略。

```markdown
# Review：<被审查对象>

## 审查结论

- 裁决：approve | request_changes | needs_more_evidence | blocked
- 模式：phase | delivery | standalone
- 对象：<需求、设计、计划、代码、diff、MR 或交付物的准确版本>
- Baseline：<比较基线；不适用时说明原因>
- Task Context：context r<revision> / scope r<revision> | not-applicable
- 核心理由：<为什么当前对象可以前进、必须修改、需要更多证据或无法审查>

## Fix-now blockers

- `<finding-id>`：<简短标题与阻断原因>
- none

## 审查边界与覆盖

### 审查边界

- 任务承诺：<本次对象必须满足什么>
- Task Operating Envelope：<本次实际采用的运行边界>
- 变化面：<检查了哪些文件、章节、接口、消费者或状态路径>
- 决定与当前模型：<实际核对的 UD、AD、requirements、design、contract、migration、Plan 和专业报告>
- Runtime 状态：<实际核对的 Task、Artifact、Timeline、Phase 或 not-applicable>
- 未检查表面：<没有检查什么及原因；没有则写 none>

### Type coverage ledger

| Cluster | Review type | 状态 | 证据或原因 |
| --- | --- | --- | --- |
| Behavior & Boundaries | correctness | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Behavior & Boundaries | compatibility | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Behavior & Boundaries | security | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Behavior & Boundaries | reliability | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Behavior & Boundaries | performance | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Behavior & Boundaries | adversarial/composition | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Change Integrity | scope/change hygiene | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Change Integrity | standards | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Change Integrity | simplicity | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Change Integrity | cleanliness/dead code | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Change Integrity | comments | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Change Integrity | test adequacy | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Architecture & Stewardship | taste/honest shape | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Architecture & Stewardship | architecture boundary | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Architecture & Stewardship | project fit/ownership | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Architecture & Stewardship | maintenance/debt/public surface | reviewed \| not-applicable \| evidence-gap | <证据、不可适用原因或缺口> |
| Task Coherence | decision provenance/authorization | reviewed \| not-applicable \| evidence-gap | <用户是否明确决定；文档标签不能替代授权> |
| Task Coherence | code-artifact coherence | reviewed \| not-applicable \| evidence-gap | <代码、决定和当前专业产物是否互相解释> |
| Task Coherence | artifact/runtime synchronization | reviewed \| not-applicable \| evidence-gap | <产物修订是否按 Task Runtime 登记> |
| Task Coherence | phase completion integrity | reviewed \| not-applicable \| evidence-gap | <Phase/Task 完成状态是否由代码、产物、审查与证据支撑> |

## Findings

按 `Behavior & Boundaries`、`Change Integrity`、`Architecture & Stewardship`、`Task Coherence` 分组；每个 review type 内按 `P0` 到 `P3` 排序。没有问题项时写 `none`。

### <Cluster>

#### <Review type>

##### [<finding-id>] [P0-P3] <简短标题>

- 类别：correctness | security | reliability | performance | compatibility | standards | simplicity | shape | scope | stewardship | authorization | provenance | artifact-coherence | task-state | ...
- 证据状态：confirmed | partial | needs-more-evidence
- Scope relation：introduced | amplified | pre-existing | outside-delivery-scope
- 处理方式：fix-now | follow-up | owner-decision
- 修复落点：implementation | source-artifact | runtime-state | owner-decision | re-shape | rewind
- 位置：<文件与行、接口、测试用例或产物章节>
- 触发：<具体输入、状态、调用者或扰动>
- 路径：<实际经过的分支、边界或依赖>
- 结果：<错误行为、破坏的承诺或长期成本>
- 证据：<命令、请求、代码、日志、历史或规则原文>
- 建议：<最小正确处理方向；结构问题附诚实形态与价格>
- 证据边界：<仍未确认什么>

## Finding Audit

### Partial

- `<finding-id>`：<核心成立，但相对初始候选修正了什么；完整问题项只保留在 Findings；没有则写 none>

### Overruled

- <被证据推翻、但会影响评审可信度的高信号候选及推翻证据；没有则写 none>

### Merged or duplicate

- <被合并的候选及其最终 finding-id；没有则写 none>

## Owner decisions 与 Follow-ups

### Owner decisions

- <需要 Owner 裁决的内容、关联 UD-*、所需证据或授权；没有则写 none>

### Follow-ups

- <当前对象仍可前进的原因、剩余风险承担者与下一负责人；没有则写 none>

## 证据缺口与剩余风险

### 证据缺口

- <可能改变裁决但尚未取得的具名证据；没有则写 none>

### 剩余风险

- <裁决后仍存在的风险、承担者与边界；没有则写 none>
```

被证据推翻的候选不使用 Finding 完整字段，也不分配优先级、Scope relation、处理方式或修复落点；只在其会影响评审可信度时进入 `Finding Audit / Overruled`。
