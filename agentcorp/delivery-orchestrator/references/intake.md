# Local Triage Reference

Use this when incoming work arrives as issues, bug reports, user feedback, or vague requests that need dispatch.

## Intake Principles

- Read the full batch before dispatching one item.
- Preserve the reporter's observation; add classification metadata instead of rewriting the report into your own theory.
- Classify by user impact and technical severity, not by reporter seniority or recency.
- Merge duplicates before dispatching to prevent conflicting implementation work.
- Dispatch self-contained work items so the next agent can start without reading unrelated threads.

## Classification

| Issue signal | Type | Paradigm |
| --- | --- | --- |
| Worked before and now fails | `bugfix` | `bugfix/hypothesis-driven` |
| Does not match documented or expected behavior | `bugfix` | `bugfix/hypothesis-driven` |
| Crash, data loss, or security vulnerability | `bugfix` | `bugfix/hypothesis-driven` |
| User wants a capability that does not exist | `enhancement` | `enhancement/delta-design` |
| User wants existing behavior to work differently | `enhancement` | `enhancement/delta-design` |
| Small isolated capability with no interface change | `addition` | `addition/lightweight` |
| New system or major subsystem | `greenfield` | `dev/architecture-first` |

Escalate rather than classify when the issue is a design dispute, a question, or depends on domain expertise you do not have.

## Deduplication

Strong duplicate signals:

- Same reproduction steps.
- Same error message and same surface.
- Same page, endpoint, command, or workflow with the same failure.
- One report is a subset of another.

When merging, keep the clearest title, the most complete reproduction, the highest severity, and all source issue IDs.

## Priority

| Priority | Meaning |
| --- | --- |
| P0 | Production broken for many users, data loss, or active security breach. Sponsor confirmation required. |
| P1 | Major user impact or no workaround. Sponsor confirmation required. |
| P2 | Real problem with workaround, or meaningful feature gap. |
| P3 | Minor friction, cosmetic issue, or backlog improvement. |

Bump priority for regressions, blockers, security issues, and data loss. Every priority needs a one-sentence rationale.

## Work Item Shape

Follow `references/templates/work-item.demo.md`.
