# Single-group landing: per-item step order and the return contract

This file is the local reference for `review-fixer`: the step order for each item in the **one group** assigned to you, and the contract for what you hand back. The boundary rules and the landing discipline themselves live in SKILL.md — this file does not restate them. Slicing, parallelism, merge checks, and the cross-group rollup belong to the Delivery Orchestrator.

## Steps for each item

1. **Drift check** — see SKILL.md "Landing discipline". Technical mismatch (the code changed, the suggestion no longer applies) → `needs-research`; a product or priority decision that re-research cannot settle → `needs-human`; matches → implement.
2. **Land faithfully** — change the root cause per research's fix approach (the **corrected** approach for partial items); no downgrades, no unrequested extras.
3. **Regression check** — "fails before the fix, passes after it", in a test file inside `OWNED_FILES` or in a new test file that only your group creates; editing an existing test file outside `OWNED_FILES` is a spill-over — escalate.
4. **Focused validation** — run only what the assignment names; pure documentation/comment items may skip it; never the full suite.
5. Process the group's items serially, then roll them up into this group's record.

## Return contract

Write `review/fix-records/<group-slug>.md`, recording item by item. For each:

- `verdict`: `fixed-as-suggested` (landed faithfully per research's fix approach) | `needs-research` (suggestion does not match the current code, please re-check) | `needs-human` (spilled out of `OWNED_FILES` / needs a decision / could not fix after three tries) | `not-applicable` (a misassigned false positive or item pending human confirmation)
- `fix_item_id`, `severity`
- `files_changed`: the files this item changed (all should be within `OWNED_FILES`, plus any new test file only your group creates)
- `regression_check`: what "fails before the fix" check you added (if none, explain why)
- `notes`: the drift-check conclusion + which suggestion you followed + any deviation and why
- `escalation`: only for needs-research / needs-human — state where the mismatch is, or who needs to decide what

Hand this record back to the Orchestrator; once it has collected all groups, it runs the merge check and rolls them up into `review/fix-result.md`.
