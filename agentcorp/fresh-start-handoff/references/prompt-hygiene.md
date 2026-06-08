# Prompt Hygiene: Passing Lessons Without Contamination

Use this when the old conversation includes exploration, wrong turns, or contradictory conclusions.

## The target mental model

Write to a fresh agent as if you are sending knowledge back to a past version of yourself: preserve the discoveries that matter, but do not make the fresh agent live inside the old failed trajectory.

The prompt should feel like a clean task brief plus a lab notebook of verified findings, not a transcript.

## Classify old information

### Keep as source-of-truth

- Explicit user requirements that still apply.
- Facts verified from files, tests, logs, docs, or command output.
- Decisions the user accepted.
- Constraints that prevent repeated mistakes.

### Keep as warning, not state

- Failed approaches.
- Incorrect assumptions.
- Partial patches that were not validated.
- Workarounds that masked the real issue.
- Suspicious test results.

### Drop or quarantine

- Chronological chat history.
- Assistant speculation.
- Emotional commentary.
- Duplicate recaps.
- Old code snippets unless needed to name an anti-pattern.
- “Maybe” hypotheses that the new agent can cheaply re-check.

## Convert narratives into clean constraints

Bad:

```text
We first tried changing the router, then realized the middleware might be wrong, then added a temporary guard, but that broke SSR, so maybe the auth layer is the problem.
```

Better:

```text
Do not start by changing the router. A previous router-level guard broke SSR. Re-check the auth middleware boundary first and validate SSR after any auth change.
```

Bad:

```text
The old agent thought cache invalidation was the issue.
```

Better:

```text
Cache invalidation is unverified. Do not rely on it as the root cause unless confirmed by a failing/passing test or log evidence.
```

Bad:

```text
Continue from the current diff.
```

Better:

```text
The current diff is exploratory. Treat it as reference only unless tests confirm a specific hunk. Prefer starting from the clean base branch.
```

## Use confidence labels

Use labels so the new agent knows how to trust each item:

- `VERIFIED`: backed by repo/test/log/user instruction.
- `ACCEPTED`: user-approved design or constraint.
- `UNVERIFIED`: plausible but must be checked.
- `FAILED`: tried and did not work; do not repeat blindly.
- `REFERENCE_ONLY`: historical material; do not import without re-validation.

## Keep failed attempts short

Each failed attempt should have this shape:

```text
FAILED: [approach]. Evidence: [test/log/user correction]. Lesson: [what to avoid or verify next].
```

Do not include a long traceback unless it is the evidence the new agent must inspect.

## Make the new prompt self-correcting

Include this instruction near the end:

```text
If repository reality contradicts this prompt, trust the repository and report the mismatch before changing code.
```

This is the guardrail that prevents even a well-written handoff from becoming a new stale assumption.
