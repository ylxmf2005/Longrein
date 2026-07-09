# 技能进化提案 — 格式

`session-end-capture` hook（注册为 `SessionEnd` hook）每个会话写一个文件到 `teamspace/skill-evolution/pending/<ts>-<session>.md`，内含零条或多条提案。若一个会话没有可提的内容，则不写文件（分析器产出 `NO_PROPOSALS`）。这个形状的权威产出方是插件根目录的提示词 `hooks/skill-evolution-analyze.md`；本文件是给消费方看的文档——任何 schema 改动都必须在同一次落地里两个一起改。

## Frontmatter

- `artifact_type: SkillEvolutionProposal`
- `session_id: <id>`
- `status: pending` —— 当文件离开 `pending/` 时改写为 `landed` 或 `rejected`（见生命周期）。

## 每条提案块

- **target**：已有 skill 名（如 `delivery-orchestrator`），或 `NEW: <主题>`（要新建的 skill）。
- **trigger**：`user-noticed` | `agent-trial-and-error` | `external-research`。
- **signal**：来自会话的具体证据——实际发生了什么。
- **proposed change**：具体的编辑，或要做的调研；优先强制/结构，而非会被忽略的散文。
- **blast radius**：`wording` | `behavior` | `structural` | `new-skill`。
- **suggested lane**：`fast`（措辞/强制，一个或几个文件）| `full`（结构性改动或新建 skill——交付 pipeline）。
- **confidence**：`high` | `medium` | `low`。

## 生命周期

结果按提案逐条记录；文件按文件整体移动。提案自身绝不编辑 skill；落地始终过人审 gate。

- **按提案**：`skill-evolution` skill 核实信号、选车道、起草、过门（standards + 人审），然后落地或驳回。把结果记为紧跟在该提案块之下追加的一个 `## Outcome` 小节：决定（`landed` | `rejected`）、一行理由、产出路径（落地时写两棵树里被编辑的文件）。
- **按文件**：只有当文件里每条提案都有了 `## Outcome`，文件才离开 `pending/`。此时改写 `status:` 并移动文件——只要有至少一条提案落地就移到 `landed/`，否则移到 `rejected/`。绝不移动还含有未裁决提案的文件：SessionStart hook 只统计 `pending/*.md`，提前移动会把未裁决的提案从人的视野里静默删除。
