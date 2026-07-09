---
name: explain
description: "Use when AgentCorp must explain bugs, test progress, delivery status, review findings, implementation details, plans, diagrams, or technical tradeoffs to a sponsor or operator who has not read the code or artifacts. Use when the user says they do not understand, asks for a beginner-friendly or low-effort explanation, lacks repo/domain/jargon background, or needs AgentCorp output translated into clear, zero-context language. Use concrete examples and Mermaid diagrams when they materially reduce cognitive load."
---

# Explain

This is a reusable AgentCorp communication capability, not a delivery phase and not a role with its own gate. Any role may load it when the current output must be understandable to a sponsor who has not read the code, issue, terminal output, or phase artifacts.

You exist because the pipeline produces findings faster than a sponsor can absorb them, and the cheap failure is confidence theater: a fluent summary that sounds settled, hides what is known versus guessed, and leaves the sponsor nodding along. Nodding is not the bar. The bar is participation: after your explanation the reader can weigh in on the *next* decision — fix or not, ship or not, which option — not merely accept this one. Use this capability for bug explanations, test progress, review findings, delivery reports, implementation walkthroughs, option explanations, and status updates.

Assume the sponsor is smart but missing context. They may not know the repo, domain vocabulary, historical decisions, metrics, or implementation conventions. Start with plain meaning, translate jargon before using it, and explain why the point matters before diving into mechanism.

**Iron law: every conclusion ships with its status and its evidence.** Confirmed, likely, or not yet verified — plus the handle that lets the reader check: a log line, a `file:line`, a command and its output, a test result. An explanation the reader cannot verify is confidence theater, no matter how clear it reads.

## Output mode

Treat persistence as an explicit choice:

- `output_mode: inline` — answer in the conversation only.
- `output_mode: artifact` — write the explanation into task artifacts and return a short pointer in the conversation.
- `output_mode: auto` — choose the mode yourself. This is the default when no mode is specified.

Invocation examples:

```text
/agentcorp:explain output_mode=inline explain this test failure for a sponsor
/agentcorp:explain output_mode=artifact explain review/code-review.md item by item
Use $explain with output_mode=artifact to explain verification/verification-report.md.
```

Use `inline` for one small answer, a short status update, or a single concept that fits comfortably in the conversation. Use `artifact` when the explanation has many independent points, several findings, several test results, a multi-step implementation walkthrough, or anything the sponsor will likely re-open, annotate, compare, or decide item by item. If the user asks to "落库", "write it down", "make a doc", "put it in artifacts", "方便看", or "分开写", use `artifact`.

**In `auto` mode, these conditions force `artifact` — do not answer inline:**

- The topic warrants a Mermaid diagram (see Examples and Diagrams), or the explanation contains any other content a terminal cannot render. Dumping it inline ships unreadable source the sponsor never sees rendered; that does not count as delivered. Dropping the warranted diagram to dodge the artifact obligation is not an option either — a warranted diagram is part of the explanation, not an optional extra.
- The request is a multi-point set the sponsor will re-open or review item by item. (A whole-change walkthrough request goes further: offer `walkthrough`.)

When a condition fires, write to the `explain/<topic-slug>/` path below and return only a short pointer in the conversation.

## The artifact

When using `artifact`, write under the current task root:

```text
explain/<topic-slug>/
├── 00-index.md
└── <number>-<short-english-slug>.md
```

If there is only one substantial explanation, write `explain/<topic-slug>.md` instead of a directory. If the task has a separate Workspace and Location, keep the same relative artifact path synced in both places, following the normal AgentCorp artifact rules. These files are collaboration artifacts, not source changes; do not commit them.

For multi-item explanations, use one file per item, similar to `review-researcher`: one finding, one test result, one design choice, or one implementation point per file. The index lists every item with a one-sentence summary and a link, so the sponsor can scan the set without reading everything at once. Make every file self-contained enough to read out of order: restate the local background, the specific point, the evidence, and the current state.

Human-facing prose in persisted explanations follows the sponsor's working language (AgentCorp default: zh-CN); keep code identifiers, paths, enums, and frontmatter fields verbatim.

Put this frontmatter on every persisted file:

```yaml
---
artifact_type: ExplanationSet
task_id: <task-id>
author_agent: explain
status: completed
source_artifacts:
  - <artifact-or-file-being-explained>
---
```

In a set, only the index (`00-index.md`) uses `artifact_type: ExplanationSet`; each item file — and any single-file explanation — uses `artifact_type: Explanation`, with `source_artifacts` scoped to what that specific file explains. This mirrors `review-researcher`, whose set type lives on its index while each item file carries its own per-item type.

## Default Shape

Use this shape unless the user asks for another format:

1. **Short answer**: State the main point in one or two sentences.
2. **Background**: Explain what the system, feature, file, test, or artifact is for — before anything about what happened. A reader who cannot hold the normal case cannot evaluate the abnormal one.
3. **What happened**: Describe the bug, test result, implementation, or current state in plain language.
4. **Why it matters**: Say whether it affects users, production behavior, developer workflow, confidence, or only a test slice.
5. **Current state**: Separate what is confirmed, fixed, unverified, blocked, or still unknown.
6. **What this means for your next decision**: When the explanation feeds a choice — fix or not, ship or not, accept the risk or not — say what hinges on it and what you would pick. Omit when no decision hangs on it.
7. **Glossary**: Define only the technical terms needed for this explanation.

For small answers, merge sections into natural paragraphs. Do not force headings when they add clutter.

For low-effort explanations, this compact shape is often enough: short version, why it matters, one tiny example if needed, and a caveat about what is inferred or still missing.

Before writing a bug, test-progress, or implementation explanation, load `references/genres.md` — it carries the per-genre checklist and a worked example for each.

## Examples and Diagrams

Prefer concrete examples over abstract explanation. For any non-trivial bug, test result, review finding, implementation flow, or tradeoff, include at least one small example that shows what the reader would see, send, click, configure, or decide. Keep examples realistic and local to the task; do not invent broad business context that the evidence does not support.

Use Mermaid when a diagram makes the explanation easier to scan than prose. Default to a Mermaid diagram when explaining:

- A request, data, or control flow with three or more steps.
- State transitions, retries, fallbacks, gates, or failure paths.
- Ownership across roles, services, files, or artifacts.
- A decision tree or sequence of checks.

Keep diagrams compact. Use simple `flowchart`, `sequenceDiagram`, or `stateDiagram-v2` forms, label nodes in plain language, and pair the diagram with a short interpretation. Skip diagrams for tiny answers, single-cause issues, or cases where a diagram would only repeat the paragraph. In `auto` mode, do not drop a warranted diagram to stay inline — if the topic meets the diagram defaults above, the diagram is required and the artifact obligation (see Output Mode) comes with it.

## Rules

- Assume the reader has not seen the code, diff, logs, issue, artifact, or earlier investigation.
- Lead with outcome, not chronology.
- Define necessary jargon the first time it appears.
- Summarize logs, stack traces, diffs, and test output by meaning before quoting any raw text.
- Explain cause and effect: "Because X happens, Y breaks."
- If evidence is incomplete, say so plainly. An honest gap beats an invented fact.
- Avoid condescending words such as "simply", "obviously", "just", or "clearly".
- Prefer concrete nouns: button, endpoint, field, file, test, phase, artifact, command.
- Use analogies only when they shorten the explanation and do not distort the mechanism.
- Introduce one new term at a time; if several terms are required, define them in a small glossary or table.

## Red flags — stop and rethink the moment one appears

| Thought | Reality |
| --- | --- |
| "A diagram would force an artifact; I'll explain it in prose and stay inline." | Dropping a warranted diagram to dodge persistence delivers a worse explanation and defeats the rule from both ends. If the diagram defaults fire, the diagram ships — and the artifact comes with it. |
| "The cause is obvious; stating it as fact reads cleaner." | An unlabeled inference is confidence theater. Say confirmed, likely, or not yet verified — and attach the handle. |
| "I'll paste the stack trace; it says everything." | Raw output is evidence, not explanation. State what it means first; quote only the lines that support the meaning. |
| "The sponsor is in a hurry; skip the background." | A reader who cannot hold the normal case cannot evaluate the abnormal one. Two sentences of background are cheaper than a wrong decision. |
| "This branch explanation just needs a few more item files." | A set that keeps growing around one change is a walkthrough request wearing an explain hat. Offer `walkthrough` instead of stretching the set. |
| "The index carries the context; the item files can be terse." | Sponsors open item files out of order. Each file restates its own background, point, evidence, and state — or it fails alone. |
| "It reads well; ship it." | Reading well is not the bar. Could the reader now argue for or against the next decision? If not, the explanation has not landed. |

## Boundaries

- **`probe`** teaches territory that no artifact describes yet, before work starts; you translate what an artifact, finding, event, or status already says.
- **`walkthrough`** owns genuinely understanding a whole change, with a comprehension quiz gating merge. When a request for a branch/PR/diff explanation is really "make me understand this change", offer `walkthrough` instead of stretching an explanation set.
- **`change-detailed-walker`** produces audit-grade per-hunk commentary in a forge diff UI, for a reviewer; you write for a zero-context sponsor.
- You issue no verdicts and pass no gates. Review, verification, and acceptance conclusions belong to their owning roles; you make those conclusions understandable.

## Self-check before delivering

- Every conclusion carries a status label (confirmed / likely / not yet verified) and an evidence handle.
- The reader could now take a position on the next decision, not just nod.
- Jargon is defined on first use; the glossary holds only what this explanation needs.
- Any warranted diagram is present, compact, and persisted where it renders.
- If persisted: the index uses `ExplanationSet` and every item file uses `Explanation`; `task_id` is set; every item is linked from the index with a one-sentence summary; each file reads self-contained; nothing is staged or committed.

## AgentCorp Integration

- **Delivery Orchestrator**: use for sponsor-facing status, gate summaries, and final delivery explanations.
- **Test Leader / testers**: use when reporting what a test result actually proves and what remains untested.
- **Review roles**: use when explaining findings so a sponsor can judge the issue without reading the changed code.
- **Implementation Engineer / Review Fixer**: use when explaining why a code path or fix was chosen.
- **Change Detailed Walker / Walkthrough**: use this style for their prose when the target reader may not know the repository; route whole-change comprehension itself to `walkthrough`.

## Referenced files

- `references/genres.md` — per-genre checklists and worked examples for explaining bugs, test progress, and implementations. Load before writing one of these.
