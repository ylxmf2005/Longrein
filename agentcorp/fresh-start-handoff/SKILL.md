---
name: fresh-start-handoff
description: "Use this skill during coding tasks when the current conversation or workspace may contaminate the next implementation: long multi-turn debugging or refactors, repeated failed fixes, scattered or changed requirements, stale assumptions, contradictory conclusions, large uncommitted diffs, or user phrases like \"start over\", \"new chat\", \"handoff\", \"clean slate\", or \"context is messy\". Ask before recommending a fresh session, then write a clean handoff prompt that converts sharded context into a full task spec and separates verified facts from failed attempts."
license: MIT
compatibility: Portable Agent Skills format; best with coding agents that can read project files and optionally inspect git status.
metadata:
  version: "0.1.0"
  tags: "coding, handoff, context, git, reliability"
---

# Fresh Start Handoff

Use this skill to prevent multi-turn conversation drift in coding work. The goal is not to summarize everything. The goal is to decide whether the current thread has become a liability, ask the user whether to start fresh, and if they agree, return a clean handoff prompt they can paste into a new agent/session.

The core move is: convert sharded context into one full, source-of-truth prompt while quarantining exploration, false starts, and stale assumptions.

## Operating principles

1. Preserve only what should survive the reset: current objective, explicit user constraints, verified repository facts, accepted decisions, validation results, and useful negative lessons.
2. Treat previous assistant conclusions as low-trust unless confirmed by files, tests, command output, or explicit user correction.
3. Include failed attempts as anti-patterns or constraints, not as a narrative the new agent should continue from.
4. Keep the new prompt self-contained. It should tell a fresh agent what to do without needing the old conversation.
5. Do not open a new session yourself. Return the handoff prompt to the user.
6. Do not discard, reset, stash, commit, or branch user work unless the user explicitly approves that action.

## When to activate

Run a quick freshness check at natural phase boundaries: before a major refactor, after repeated failed debugging, before committing, after the user changes requirements, when the current answer is getting long and historical, or when the user hints that the context is messy.

Use this score as a guide:

- +3: The user says or implies “start over,” “new chat,” “handoff,” “clean slate,” “context is messy,” “we’re lost,” or “give me a prompt for another agent.”
- +3: Two or more attempted fixes/implementations failed on the same underlying issue.
- +3: You discover that an earlier architectural assumption or diagnosis was wrong.
- +2: Requirements were revealed across many turns or changed after implementation started.
- +2: The proposed next step depends on remembering several earlier constraints or exceptions.
- +2: The working tree has exploratory or broad uncommitted changes, especially across multiple modules.
- +2: The task is moving from exploration/debugging into a clean implementation phase.
- +1: The conversation contains contradictory conclusions, bloated recaps, or “don’t do X again” corrections.
- +1: Validation results are mixed, stale, or unclear.

If the score is 3 or higher, pause and ask. If it is 5 or higher, strongly recommend a fresh handoff. Do not interrupt for a straightforward one-step change, a small follow-up where context is still crisp, or when the user recently declined a restart and the risk has not materially increased.

If unsure, read [references/activation-matrix.md](references/activation-matrix.md).

## How to ask the user

If the user explicitly asked for a handoff prompt, skip the question and write it. Otherwise ask once, briefly:

```text
This looks like a good checkpoint for a fresh coding session: [one concrete reason].
Do you want me to generate a clean handoff prompt? I can also include a safe git isolation plan so the new session starts from a clean branch instead of inheriting exploratory changes.

Reply with:
A) prompt only
B) isolation plan + prompt
C) continue here
```

If the user chooses C, continue the original task and do not ask again unless the risk increases. If they choose A or B, generate the handoff.

## Handoff workflow

1. **Inventory current truth.** Prefer source files, tests, `git status`, diffs, logs, and explicit user instructions over conversation memory. If you have tool access, inspect the repository before writing the prompt. If you do not, state what is unknown.
2. **Classify information.** Use these buckets:
   - Current objective
   - Definition of done
   - Verified facts and evidence
   - Relevant files and entry points
   - Accepted constraints and decisions
   - Failed attempts / do-not-repeat lessons
   - Suspect or unverified assumptions
   - Current workspace state
3. **Choose workspace stance.** Decide whether the new session should start from the current dirty tree, a clean base branch, a stash, an archive branch, or an exploratory branch. For details, read [references/workspace-isolation.md](references/workspace-isolation.md).
4. **Write the prompt.** Use the structure in [references/handoff-template.md](references/handoff-template.md). If the conversation contains lots of false starts, also read [references/prompt-hygiene.md](references/prompt-hygiene.md).
5. **Return the prompt directly to the user.** Put the final handoff prompt in a fenced markdown block so the user can copy it into a new session.

## What the final response should contain

When the user confirms handoff, respond with:

1. A one-paragraph recommendation: why a fresh context is useful now and what workspace stance you recommend.
2. Optional safe commands or a non-destructive isolation checklist, only if relevant and allowed by the user.
3. The copy-paste handoff prompt in a fenced `markdown` block.

Do not bury the prompt under a long retrospective. The user should be able to copy it immediately.

## Minimal handoff prompt skeleton

```markdown
You are starting fresh. Do not rely on any previous conversation. Treat this prompt and the current repository state as the source of truth.

## Objective
[Specific task]

## Definition of done
[Observable success criteria]

## Repository/workspace stance
[Start from clean branch/current branch/archive branch/etc.]

## Relevant files
[Files, modules, commands, entry points]

## Verified facts
[Only facts backed by files, tests, command output, or explicit user instruction]

## Constraints and decisions
[What must be preserved or avoided]

## Failed attempts / do not repeat
[Short anti-patterns with why they failed. Do not continue from them blindly.]

## Suspect or unverified assumptions
[Things to re-check before relying on them]

## Suggested approach
[High-level implementation plan]

## Validation plan
[Commands/tests/manual checks]

## Communication rules
Ask before destructive git operations. Keep changes minimal unless broader refactor is justified. Report any mismatch between this prompt and repository reality.
```

## Common mistakes to avoid

- Do not write a chronological “what happened in chat” transcript.
- Do not pass forward failed code as a starting point unless it is intentionally archived and labeled.
- Do not say “we already know X” unless X is verified.
- Do not mix the old workaround and the new plan in the same instruction.
- Do not let the new agent inherit dirty workspace state by accident; either explain the dirty state or recommend isolating it.
- Do not include every file touched; include only files likely relevant to the next attempt, plus a separate workspace-state note.
