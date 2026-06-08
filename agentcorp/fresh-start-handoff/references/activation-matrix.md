# Activation Matrix

Use this file when you are unsure whether to interrupt a coding task and suggest a fresh session.

## Strong triggers: ask immediately

Ask whether to create a fresh handoff prompt when any of these occur:

- The user explicitly mentions a fresh context: “new chat,” “start over,” “handoff,” “clean prompt,” “context rot,” “we got lost,” “another agent,” “from scratch,” or similar.
- Two or more attempts at the same bug failed and the next plan relies on avoiding previous mistakes.
- You found a wrong premise that influenced prior code or explanations.
- The task changes from exploration to implementation, especially after many turns of diagnosis.
- The working tree contains exploratory changes and the next step should be cleaner than the current diff.
- The user adds constraints that contradict earlier assumptions.
- You are about to perform a broad refactor based mainly on conversation memory.

## Medium triggers: ask if two or more are present

- The task spans multiple files, packages, services, or layers.
- Requirements arrived incrementally across several user messages.
- The conversation includes many “actually,” “don’t,” “instead,” or “not that way” corrections.
- Validation results are stale or mixed.
- The current answer needs a long recap before taking action.
- There are unresolved questions that a fresh agent could verify from the repo.
- You are tempted to reuse partial code from a failed attempt.

## Non-triggers: keep working here

- A simple bug fix with a clear file and test.
- A small follow-up to a just-completed successful change.
- The user is asking for explanation only, not implementation.
- The user recently declined a handoff and no new risk appeared.
- There is no meaningful old state to contaminate the next step.

## Suggested phrasing by score

Score 3-4:

```text
This may be a good point for a fresh handoff because [reason]. Want me to create a clean prompt, or should I continue here?
```

Score 5+:

```text
I recommend a fresh handoff before the next implementation step because [reason]. Continuing here risks carrying forward stale assumptions. Want me to produce the new-session prompt and a safe workspace-isolation plan?
```

## Bias

Bias toward asking when the cost of interruption is low and the cost of stale context is high. Bias against asking when the user is in the middle of a simple, concrete edit.
