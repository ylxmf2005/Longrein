---
id: diagnose
name: Bug Diagnosis
inputs: [validated requirements (bug report), reproduction steps if available]
outputs: [diagnosis doc with hypotheses tested, root cause, proposed fix, affected files, risk]
optional: false
---

# Phase: Bug Diagnosis

## Purpose

Identify the root cause of a defect through structured, hypothesis-driven debugging. No guessing — every investigation step starts with an explicit hypothesis and ends with evidence.

## Process

### Step 1 — Hypothesize

Based on the bug report and reproduction steps, estimate where the problem likely originates. Form a specific, testable hypothesis before touching code.

**Good hypothesis:** "The session token is not refreshed after password change, so old tokens remain valid."
**Bad hypothesis:** "Something is wrong with auth."

### Step 2 — Verify

Test the hypothesis. Read the suspected code, add logging, or run a targeted test. Confirm or refute with evidence.

- If confirmed → proceed to Step 5
- If refuted → proceed to Step 3

### Step 3 — Build Observability

If the hypothesis is wrong and no further clues exist, add instrumentation (logs, debug output, tracing) to gather data for new hypotheses. Do not guess blindly.

### Step 4 — Iterate

Repeat hypothesize → verify until root cause is found. Distinguish:
- **Proximate cause** — this line is wrong
- **Root cause** — the data model doesn't account for this case

### Step 5 — Propose Fix

Describe the minimal change that fixes the root cause. List affected files, assess regression risk.

**Escalation:** If the fix requires 3+ module changes or interface changes → escalate to `enhancement/delta-design` paradigm.

## Efficiency Rules

- If a check is slow or expensive, narrow the hypothesis and run the smallest real check that can confirm or refute it.
- Do not replace real behavior with dummy returns or mocks as proof of root cause.
- If you catch yourself doing aimless testing with no clear hypothesis, **stop immediately** and think. Formulate an explicit hypothesis before running the next test.

## Output Format

Write diagnosis to the assignment's `output_path`, normally `design/diagnosis.md`.

**Required sections:**
1. Bug summary (one paragraph)
2. Hypotheses tested (for each: hypothesis, evidence, result)
3. Root cause (with evidence)
4. Proposed fix (minimal change description)
5. Affected files
6. Regression risk assessment
7. Bugfix diagrams: at least two complete Mermaid fenced code blocks with the `mermaid` info string, including one explicit before/after diagram showing the failing path before and the corrected path after. This is a lower bound; add or split diagrams when multiple views are clearer.

Mermaid diagrams are mandatory for bugfix/fix diagnosis because the artifact describes a behavior change. Make them complete enough to inspect the fix: include the actor/trigger, entry point, failing component, root-cause state or decision, target corrected component/path, preserved behavior, and success/failure outcomes. Keep each diagram human-readable in Markdown: target at most 8 nodes for flowcharts or 6 participants and 12 messages for sequence diagrams, split larger views, and move long call-chain detail to adjacent bullets. Do not use rough placeholder diagrams such as `User --> System --> DB`, and do not leave generic example labels in the final artifact. Validate the fenced Mermaid blocks with `mmdc`/Mermaid tooling when available; otherwise record manual validation evidence covering block count, before/after presence, diagram declaration, task-specific labels, placeholder replacement, edge syntax, and readability budget. Do not generate separate rendered files unless the sponsor explicitly asks for them.

## Outputs
- Markdown diagnosis at the assigned `output_path`.

## Quality Gate
- Root cause identified with evidence (not just a guess)
- Fix scoped to minimal change
- Regression risk assessed
- Affected files listed
- Proximate vs root cause distinction is clear
- At least two complete Mermaid diagrams are present, including one before/after diagram; more are present when needed for readability
- Mermaid validation evidence is recorded

## Skip Conditions
This phase is never skipped in the `bugfix/hypothesis-driven` paradigm.
