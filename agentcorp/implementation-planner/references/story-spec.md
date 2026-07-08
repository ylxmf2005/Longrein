# Implementation Story Spec

Turn the approved requirements and design into an executable plan the Implementation Engineer can build against. It deliberately sits between design and code: requirements say what outcome is wanted, the TestPlan/Test Strategy says what must be proven, architecture/impact/diagnosis/contract say what the system should look like — and this Story Spec says what the engineer actually has to implement.

## What you do

Read the source artifacts carefully and base the slicing on what the system actually looks like, not on what you assume it looks like. Slice the work into coherent, ordered, independently verifiable stories/tasks: give each slice clear boundaries and a landing point, order tasks so the sequence reflects real dependencies, and size them so the engineer can complete and verify each one in turn. Reference the source artifacts to carry the detail, then spell out the judgments specific to this implementation, rather than copying the design over verbatim.

## What this artifact must achieve

When the engineer finishes reading it, they should be able to start without reverse-engineering the scope or remaking design judgments on the spot. So it must make clear (organized in whatever structure best serves the implementation):

- the story for this implementation — who/what role, the capability or change wanted, the outcome it produces;
- the source context needed to start: a concise pointer to the source artifacts, plus the few key facts the engineer needs to know right away;
- observable acceptance criteria, each traceable to a requirement;
- an ordered list of tasks/subtasks, marking the landing module/file where known, and linking each task to the acceptance criterion or technical guardrail it serves;
- design constraints: module boundaries, the patterns to follow, the interfaces/contracts that must stay stable, and the data/security/reliability guardrails;
- for an enhancement or bug fix, list the existing behavior that must keep working; when a public or cross-module interface changes, spell out the contract;
- forbidden zones and non-goals, so the engineer doesn't overreach or expand scope;
- verification expectations: reference the decision criteria in the TestPlan or diagnosis (give path and section), and name only the focused checks the engineer should add or run during implementation — the Test Leader owns the final verification evidence;
- where the Plan Review Lead should focus.

Give as much detail as it takes for the engineer to start without ambiguity; where the detail is dense, use a table or bullet list. If there is any open question that would change the implementation's direction, don't bury it — either spell it out, or return `blocked` along with the missing design.

## Shape

Follow `templates/implementation-story-spec.demo.md` where it is needed or useful. Initialize Status to `ready-for-plan-review`; do not mark a Story Spec you authored as ready to develop — that waits for the Plan Review Lead's approval.

## Pre-delivery self-check

Before returning the receipt, confirm every line:

1. Every acceptance criterion is observable and traceable to a requirement; every task names the criterion or guardrail it serves, and its landing module/file where known.
2. Task order reflects real dependencies, and each story is verifiable on its own — not only when everything is finished.
3. Constraints, behavior that must keep working, and forbidden zones are stated; any new dependency, data migration, auth change, public API change, or UI design change is an explicit call-out for review, not an ordinary task.
4. Verification expectations separate the engineer's focused checks from the TestPlan/diagnosis decision criteria (cited by path and section) whose final evidence the Test Leader owns.
5. No open question that would change the implementation's direction is buried: it is spelled out in the spec, or the plan is `blocked` naming the missing design.
6. Status is `ready-for-plan-review` (or `blocked` per the protocol's blocked rule), the frontmatter matches the demo, and the Review Focus section tells the Plan Review Lead where to look.
