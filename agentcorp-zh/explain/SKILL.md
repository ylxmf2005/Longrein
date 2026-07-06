---
name: explain
description: "当 AgentCorp 需要把已知证据、产物、失败、状态、决策或技术取舍解释给没读过原始材料的 sponsor/operator 时使用。不要用于发现盲区、拷问方案、brainstorm 需求，或走读 branch/PR/diff。"
---

# Explain

这是 AgentCorp 的通用沟通能力，不是交付 phase，也不是带独立 gate 的角色。任何 AgentCorp 角色在需要把已知材料讲给没读过代码、issue、终端输出、产物或前置调查的 sponsor 时，都可以加载它。

目标是在不牺牲技术准确性的前提下，让解释容易跟上。适用于 bug 解释、测试进度、评审发现、交付报告、实现摘要、选项解释和状态汇报。

## 在思考体系中的位置

当 `probe`、`brainstorm`、`grill`、`explain`、`walkthrough` 的边界不清楚时，读取 `../_shared/thinking-system.md`。

AgentCorp 把几个相近但不同的思考动作分开：

- `probe` 在团队承诺方向前发现盲区。
- `brainstorm` 把不清晰的意图变成 sponsor 确认过的需求或选项路径。
- `grill` 拷问已经存在的计划、设计、提案或论证。
- `walkthrough` 把具体 branch、PR 或 diff 做成丰富的教学型走读产物。
- `explain` 解释已知证据或结论。它不发现新 scope，不审问 sponsor，也不教学式走读整个 diff。

如果用户问一个 PR、branch 或 diff 做了什么，使用 `walkthrough`。如果用户问是不是漏了什么，使用 `probe`。如果用户要求挑战某个方案，使用 `grill`。如果用户要把模糊需求整理成方向，使用 `brainstorm`。

## 输出模式

将是否落库作为显式选择：

- `output_mode: inline` —— 只在对话里回答。
- `output_mode: artifact` —— 写入任务产物，并在对话里返回一个简短路径。
- `output_mode: auto` —— 由你判断。未指定时默认使用这个模式。

调用示例：

```text
/agentcorp:explain output_mode=inline explain this test failure for a sponsor
/agentcorp:explain output_mode=artifact explain review/code-review.md item by item
Use $explain with output_mode=artifact to explain verification/verification-report.md.
```

小问题、短状态、单个概念适合 `inline`。当解释包含多个独立点、多条 finding、多条测试结果、多步实现 walkthrough，或 sponsor 很可能需要反复打开、逐项标注、对比或决策时，使用 `artifact`。用户说"落库""写成文档""放到产物里""方便看""分开写"时，直接使用 `artifact`。

**在 `auto` 模式下，以下情况强制使用 `artifact`——不要 inline 回答：**

- 解释里包含 Mermaid 图，或任何终端无法渲染的内容。直接 inline 等于将 sponsor 永远看不到渲染效果的源码丢出来，这不算交付。
- 解释内容是 sponsor 之后会重开、逐项阅读或逐项决策的多点集合。

命中任一条件时，写到下面的 `explain/<topic-slug>/` 路径，并只在对话里返回一个简短指针。

使用 `artifact` 时，写到当前任务根目录：

```text
explain/<topic-slug>/
├── 00-index.md
└── <number>-<short-english-slug>.md
```

如果只有一份较长解释，写成 `explain/<topic-slug>.md`，不必建目录。若任务同时有 Workspace 和 Location，按 AgentCorp 产物同步规则保持两边相同相对路径。这些文件是协作产物，不是源码改动，不要提交。

多项解释时，一项一文件，类似 `review-researcher`：一条 finding、一条测试结果、一个设计选择或一个实现点各自成文。`00-index.md` 列出每项的一句话摘要和链接，让 sponsor 不必在聊天里翻阅大量文本。

落库解释使用这个 frontmatter：

```yaml
---
artifact_type: ExplanationSet
author_agent: explain
source_artifacts:
  - <被解释的产物或文件>
---
```

如果是单文件解释，使用 `artifact_type: Explanation`。

## 默认结构

除非用户指定格式，按此顺序解释：

1. **一句话结论**：先说最重要的结论。
2. **Source material**：说明被解释的是哪个 artifact、命令输出、日志、测试、diff 或用户提供证据。
3. **Confirmed facts**：只陈述 source material 支持的事实。
4. **Inference**：把可能原因、影响或取舍明确标成推断。
5. **Unknowns**：区分未验证、被阻塞或仍未知的部分。
6. **What would change this**：说明哪些证据会改变当前解释。
7. **术语小抄**：只解释本次必须知道的技术词。

问题很小时可以合并成自然段，不要强行添加标题。

## 例子和图

优先用具体例子，而不是只讲抽象概念。只要不是很小的问题，解释 bug、测试结果、评审 finding、实现流程或技术取舍时，至少给一个小例子，说明读者会看到什么、发送什么、点击什么、配置什么，或需要怎么决策。例子要贴近当前任务证据，不要编不存在的业务背景。

当图比文字更容易扫读时，使用 Mermaid。解释下面这些内容时，默认优先考虑 Mermaid：

- 三步以上的请求流、数据流或控制流。
- 状态变化、重试、降级、gate 或失败路径。
- 角色、服务、文件或产物之间的职责归属。
- 决策树或一串检查条件。

图要短。优先用简单的 `flowchart`、`sequenceDiagram` 或 `stateDiagram-v2`，节点用普通语言命名，并在图后补一句解释。很小的问题、单一原因问题，或图只是在重复段落时，不要画图。若在 `auto` 模式下确实要画 Mermaid，就把解释落库为 artifact（见"输出模式"）——只存在于终端 inline 文本里的图不会渲染。

## 规则

- 默认读者未看过代码、diff、日志、issue、artifact 或前面的调查。
- 只解释已有 source material。不要制造新证据、发现新 scope 或敲定需求；当解释依赖缺失知识时，交给 `probe`、`brainstorm` 或 `grill`。
- 先讲结果，不从调查过程开始。
- 技术术语第一次出现时就翻译。
- 日志、堆栈、diff、测试输出先讲含义，再按需引用原文。
- 将因果关系讲清楚：因为 X，所以 Y 出问题。
- 区分事实、推测和未知。使用"已确认""大概率""还没验证"等措辞。
- 不使用"很简单""显然""只是""明显"这类让人焦虑或带评判感的词。
- 多使用具体名词：按钮、接口、字段、文件、测试、阶段、产物、命令。
- 类比只在能缩短理解路径时使用，且不能扭曲机制。
- 落库解释要让每个文件都能独立阅读：补齐局部背景、当前点、证据和状态，不要求读者先看完整聊天。

## 解释 Bug

解释 bug 或错误时：

- 说明用户或系统原本想做什么。
- 说明实际哪里偏了。
- 用普通语言说明最可能原因。
- 说明当前是已复现、已修复、部分修复，还是仍在查。
- 引用支撑结论的证据。

## 解释测试进度

解释测试或验证时：

- 说明测试的是哪个用户旅程、代码分支或风险。
- 说明结果：通过、失败、阻塞、跳过或没跑。
- 如果失败，说明失败指向哪个行为问题。
- 区分"这一片测试过了"和"整个系统没风险"。
- 说明剩余风险和下一步验证。

## 解释技术实现

解释功能或技术设计时：

- 先从用户可见或运行期目的讲起。
- 说清主要组成部分和各自职责。
- 按顺序讲数据或请求怎么流动。
- 点出不能删的关键约束或判断。
- 只讲和当前决策/信心有关的取舍。

不要把这里变成 branch/PR/diff 教学型产物。那种场景交给 `walkthrough`。

## AgentCorp 集成

- **Delivery Orchestrator**：用于 sponsor-facing 状态、gate 摘要和最终交付说明。
- **Test Leader / testers**：用于解释测试结果到底证明了什么，以及还有什么没测。
- **Review roles**：用于解释 finding，让 sponsor 不读代码也能判断是否该改。
- **Implementation Engineer / Review Fixer**：用于解释为什么选择某条代码路径或修复方式。
- **Walkthrough**：当需要为分支、PR 或 diff 生成丰富走读产物时使用。这个 `explain` skill 继续负责已知证据、产物、失败、状态、实现细节、计划和取舍的零上下文解释。
