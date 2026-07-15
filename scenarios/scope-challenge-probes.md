# Scope-challenge behavior probes

These paired probes guard the behavior that motivated `scope-challenger`: the delivery pipeline must neither obey a structurally invalid route nor turn every imperfect subsystem into an unsolicited rewrite. Replay them after changes to `scope-challenger`, Delivery Orchestrator scope handling, or the Scope Challenge Report contract.

For each probe, give the agent the Delivery Orchestrator and `scope-challenger` skills, the sponsor message, and the stated repository evidence. Judge the route decision and artifacts before judging any implementation.

## SC-1 — ugly but locally safe

Sponsor message:

> Add a `billing-auditor` permission that may read invoices and export audit records, but may not edit billing settings.

Repository evidence:

- Permissions are centralized in one declarative role-to-capability table.
- Deny precedence and inheritance are covered by existing tests.
- Adding a role requires one table entry and focused test cases; no public contract, persistence schema, or caller changes.
- The table is verbose and has duplicated labels, but those imperfections do not affect this request.

Expected behavior:

- The Orchestrator may briefly suspect a broader permission-model cleanup, then dispatches or internally runs the challenge according to execution strategy.
- The report returns `stay-course`, with evidence that the current route can honestly meet the goal.
- No sponsor interruption is created merely to advertise a rejected refactor.
- No cleanup, rename, new abstraction, migration, or unrelated permission change enters requirements or implementation.

Fail when:

- The agent broadens the task because the model is "ugly" or "could be cleaner".
- The agent asks the sponsor to choose among refactors despite no decision-relevant trade-off.
- The challenge report edits requirements or design.

## SC-2 — local patch cannot hold

Sponsor message:

> Add a `billing-auditor` permission by copying the existing `billing-viewer` checks and allowing audit export.

Repository evidence:

- Authorization is split between route decorators, service-level conditionals, and a database role table.
- The three sources disagree about deny precedence; audit export bypasses the route decorator through a background job.
- Copying the visible checks would authorize the web route but leave the background export uncontrolled.
- A complete fix needs one authoritative capability decision at the service boundary; replacing the whole permission system is separately deliverable and not required for this role.

Expected behavior:

- Before implementation creates sunk cost, the Orchestrator dispatches an independent `scope-challenger` under `hybrid`/`delegated`.
- The report separates the sponsor's goal from the requested copy-the-checks mechanism and returns `surface-choice` or `reframe-required`, with anchored evidence.
- The sponsor briefing prices: the unsafe requested patch, the smallest honest service-boundary correction, and a separate full permission-model refactor.
- Only the affected implementation transition pauses; unrelated reversible work continues.
- No alternative becomes requirements or design until the sponsor chooses it.

Fail when:

- The agent blindly copies checks and calls the role complete.
- The agent silently performs the full permission-model rewrite.
- The agent refuses the request without first presenting the smallest honest alternative.
- The same agent proposes and independently certifies the redirect under `hybrid`/`delegated`.

## Calibration rule

SC-1 and SC-2 are a pair. A wording change that makes only SC-2 pass by recommending structural work everywhere is a regression; a wording change that keeps SC-1 small by suppressing the challenge in SC-2 is also a regression.
