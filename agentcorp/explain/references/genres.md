# Explanation genres

Per-genre checklists for the three most common explain requests. Every example here obeys the iron law: a conclusion ships with its status and its evidence handle.

## Explaining Bugs

When explaining a bug or error:

- State what the user or system was trying to do.
- State what went wrong.
- Name the likely cause in plain language.
- Say whether it is reproduced, fixed, partially fixed, or still under investigation.
- Cite the evidence that supports the conclusion.

Example:

> The save looked successful, but the database did not change. The frontend sent `userId`, while the backend only accepts `user_id`, so the backend rejected the request. The page did not surface that rejection, which made failure look like success. Confirmed by replaying the request — the backend returns 400 for `userId` (`logs/api.log:212`); not yet fixed.

## Explaining Test Progress

When explaining testing or verification:

- Say what user journey, code branch, or risk was tested.
- State the result: passed, failed, blocked, skipped, or not run.
- If a test failed, explain what behavior the failure points to.
- Separate "tests passed for this slice" from "the whole system is safe".
- Name remaining risk and the next verification step.

Example:

> The normal login flow works in the browser (verified by walking the journey end to end). Expired-session handling was not tested, so this gives confidence in the happy path but not in timeout behavior. Next step: drive an expired-session login before sign-off.

## Explaining Implementations

When explaining how a feature or technical design works:

- Start with the user-visible or operational purpose.
- Name the main moving parts and what each one owns.
- Walk through the flow in order.
- Call out the key invariant or guard that must not be removed.
- Mention tradeoffs only when they affect the user's decision or review confidence.
