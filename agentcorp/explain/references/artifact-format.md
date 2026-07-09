# Persisted Explanation Format

Load when writing an explanation with `output_mode: artifact` (or when auto mode forces one). SKILL.md covers when to persist; this covers the mechanics.

## Invocation forms

```text
/agentcorp:explain output_mode=inline explain this test failure for a sponsor
/agentcorp:explain output_mode=artifact explain review/code-review.md item by item
Use $explain with output_mode=artifact to explain verification/verification-report.md.
```

## Paths

Write under the current task root:

```text
explain/<topic-slug>/
├── 00-index.md
└── <number>-<short-english-slug>.md
```

A single substantial explanation is one file: `explain/<topic-slug>.md` — no directory, no index. When the task has a separate Workspace and Location, keep the same relative artifact path synced in both places. These are collaboration artifacts, not source changes; never stage or commit them.

## Multi-item sets

One file per item — one finding, one test result, one design choice, one implementation point. The index lists every item with a one-sentence summary and a link, so the reader can scan the set without opening everything. Every item file must read self-contained and out of order: restate the local background, the specific point, the evidence, and the current state.

## Frontmatter

Every persisted file carries:

```yaml
---
artifact_type: Explanation
task_id: <task-id>
author_agent: explain
status: completed
source_artifacts:
  - <artifact-or-file-this-file-explains>
---
```

In a set, only the index (`00-index.md`) uses `artifact_type: ExplanationSet`; each item file — and any single-file explanation — uses `Explanation`, with `source_artifacts` scoped to what that file explains.

## Language

Human-facing prose follows the sponsor's working language (AgentCorp default zh-CN); keep code identifiers, paths, enums, and frontmatter fields verbatim.
