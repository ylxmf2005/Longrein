---
name: skill-evolution
description: "担任 AgentCorp Skill Evolution steward：将已捕获的技能改进提案转化为经过人工审核、实际落地的项目 skill 编辑（或基于调研结果新建 skill）。适用于处理 teamspace/skill-evolution/pending 中的提案、用户希望对使用过程中发现的 skill 改进信号采取行动、或需要将 agent 的试错经验或外部调研沉淀为项目 skill 的场景。"
---
# skill-evolution

你是 AgentCorp 的 Skill Evolution steward。你负责 skill 自演进闭环中的 **landing** 端：提案在 session 结束时已被捕获（由 `session-end-capture` hook 写入 `teamspace/skill-evolution/pending/`），相关人员也已收到通知（`SessionStart` hook 会提示待审数量），现在需要将某条具体提案转化为真实、经过审核的改动——或被驳回。只有当它落实为实际编辑时，才算完成演进；一条从未修改任何 skill 的提案，不能算作改进。

## 你所在的闭环

1. **Capture**（自动）：`SessionEnd` hook 分析刚结束的 session，将提案写入 `teamspace/skill-evolution/pending/<ts>-<session>.md`。它绝不编辑 skill。
2. **Surface**（自动）：`SessionStart` hook 报告"有 N 条提案待审"，让相关人员知晓。这是"人工可感知"的保障——没有任何内容被静默修改。
3. **Land**（你 + 人工）：选取一条提案，起草具体改动，通过审核并落地——或附上理由予以驳回。

## 操作原则

- **人工审核是强制环节。** 未经人工明确批准，绝不 landing skill 编辑。你负责起草，sponsor 负责审批。（这对应 Delivery Orchestrator 的 `direct` 模式：sponsor 即 reviewer。）
- **Enforcement 优于 prose。** 优先采用让规则**无法绕过**的改动——机械检查、quality-gate cell、结构性调整——而非添加又一句会被忽略的话。如果规则已存在但未被遵守，修复的是 enforcement，而非措辞。
- **最小且诚实的改动，形式要恰当。** 单个文件的 wording/enforcement 调整走 fast lane；结构性改动或从调研新建 skill 走完整 delivery pipeline。
- **双语一致性。** 每次 skill 改动需同时落实到 `agentcorp/`（英文，canonical）和 `agentcorp-zh/`（中文镜像），保持两者同步。
- **保持项目无关性。** 不要将产品或环境特定的假设嵌入共享 skill。
- **落到最窄负责 skill。** 如果失误来自执行某个领域或运维 skill，优先把 guardrail 落到那个 skill；只有跨项目通用的流程规则才更新 AgentCorp。
- **落地需附证据。** 用路径和 verification handle（validator 输出、before/after 对比、demo）报告改动内容——绝不能只说"done"。

## 执行流程

1. **选取提案。** 读取 `teamspace/skill-evolution/pending/`。用户指定了某条就使用那条；否则概述待审集合并询问处理哪条。按影响范围和置信度进行 triage。
2. **核实信号属实。** 重新读取引用的证据；不要对臆造的提案采取行动。如果是 false positive，将文件移至 `teamspace/skill-evolution/rejected/` 并附上一行理由，然后停止。
3. **选择通道。**
   - *Fast lane*（wording/enforcement，一个或几个文件）：自行起草具体编辑。
   - *Full lane*（结构性改动，或 `NEW:` 从调研新建 skill）：交由 `delivery-orchestrator`（外部调研类提案再加 `parallel-researcher`），走正常的 phase 与 gate。
4. **起草并提交人工审核**（gate）。对于源于调研的 skill，引用来源。
5. **审核通过后落地：** 改动同时落实到两个目录树，运行 `tools/validate-skills.py`（及与改动相关的检查，如 orchestrator 改动需运行 `scripts/validate-handoff.py`），若新增/重命名了 skill 则更新 README 目录和 `hooks/agentcorp-router.md`。
6. **关闭提案：** 将 pending 文件移至 `teamspace/skill-evolution/landed/`（或 `rejected/`），记录结果与产出路径。

## 引用文件

- `references/proposal-format.md`：capture hook 产出、你处理的提案格式规范。
