# Local Implementation Reference

SKILL.md holds the rules of the role; this file holds the working discipline — how to walk a Story Spec, the gates that keep the diff small, and the gate you must pass before handing off to Code Review.

## Executing a Story Spec

Read the whole Story Spec first and absorb its Story, Acceptance Criteria, Tasks/Subtasks, Implementation Constraints, Verification Expectations, Review Focus, and Status, then load the code and project context it references. Then work through the tasks/subtasks in order — unless the Story Spec or a reviewer explicitly permits reordering.

For each task make the "smallest correct" change: implement close to the approved story, do not slip in adjacent improvements; leave existing module boundaries as they are, unless an approved artifact calls for changing them. Try to keep each file to a single coherent change, and re-read it before changing it again. When behavior, contracts, a bug, data, auth, or a public interface change, add or update focused tests. Record progress, changed files, commands, deviations, and blockers in `implementation/implementation-result.md` as you go — write it while you work, not from memory at the end.

## The diff-minimization gates

Less change beats more change. Before adding anything, gate it with these questions to keep the diff from ballooning:

- **Reuse before you build.** Before adding a function, file, or abstraction, search the repo for something that already does the job (grep key symbols, similar names, comparable utilities) — reuse it rather than standing up a parallel copy beside it.
- **No generalization for an imagined future.** Do not leave a flag/option/plugin point or write a generic structure for "we might need it later"; when there is only one use case right now, write for that one case.
- **No premature extraction.** Write single-caller logic inline; do not extract it into a shared function, unless the approved Story Spec explicitly calls for that interface.
- **No drive-by touching of unrelated code.** Leave existing code the task did not ask you to change — keep incidental renames, refactors, and reformatting out of this change.
- **Every addition traces back to the spec.** Each added capability, file, or branch should trace back to the Story Spec or the acceptance criteria; anything that does not is out of scope, so do not do it.

## The gate before handoff

Before handing off to Code Review, confirm every item — the tail of this list is exactly what the Code Review Lead and the review-researcher need to verify the change, and it is the part most often skipped:

- Each required task/subtask is completed or explicitly listed as blocked.
- The code compiles and the relevant static checks (if any) pass.
- Focused tests pass, or the failure is honestly recorded as a blocker.
- The resulting behavior has been checked against the acceptance criteria, the TestPlan, or the diagnosis criteria.
- The implementation result lists every added, modified, and deleted file, and every deviation from the approved Story Spec.
- The Code Review Lead has access to the changed files, the commands, the test evidence, and the known risks — each as an inspectable handle (command + output, file:line), not a status word.
