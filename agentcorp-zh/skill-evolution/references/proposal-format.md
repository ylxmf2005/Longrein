# 技能进化提案 — 格式

`session-end-capture` hook（注册为 `SessionEnd` hook）每个会话写一个文件到 `teamspace/skill-evolution/pending/<ts>-<session>.md`，内含零条或多条提案。若一个会话没有可提的内容，则不写文件（分析器产出 `NO_PROPOSALS`）。

## Frontmatter

- `artifact_type: SkillEvolutionProposal`
- `session_id: <id>`
- `status: pending`

## 每条提案块

- **target**：已有 skill 名（如 `delivery-orchestrator`），或 `NEW: <主题>`（要新建的 skill）。
- **trigger**：`user-noticed` | `agent-trial-and-error` | `external-research`。
- **signal**：来自会话的具体证据——实际发生了什么。
- **proposed change**：具体的编辑，或要做的调研；优先强制/结构,而非会被忽略的散文。
- **blast radius**：`wording` | `behavior` | `structural` | `new-skill`。
- **suggested lane**：`fast`（一文件措辞/强制）| `full`（交付 pipeline）。
- **confidence**：`high` | `medium` | `low`。

## 生命周期

`pending/` → `skill-evolution` skill 核实信号、选车道、起草、过门（standards + 人工审核）、落地 → 然后把文件移到 `landed/` 或 `rejected/`,记录结果与产出路径。提案自身绝不编辑 skill;落地始终过人工审核 gate。
