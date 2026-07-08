# Walkthrough Artifact Format

SKILL.md covers the why; this covers the how. Load before writing the artifact.

## Form

- **HTML (default):** one self-contained file — all CSS and JS inline, no network requests, no external fonts or CDNs. Long-form single page with section headers and a table of contents; do not use tabs for the top-level structure. Responsive enough to read on a phone. Code goes in `<pre>` blocks (if a styled `<div>` is used instead, it must set `white-space: pre-wrap`). Diagrams are inline HTML/SVG with example data — simplified UI mockups, system sketches, before/after pairs; never ASCII art. Use callout boxes for key concepts, definitions, and edge cases.
- **Markdown (`output_format: md`):** the same five sections; diagrams in Mermaid (validate syntax before delivery); quiz options and answers inside collapsed `<details>` blocks so answers stay hidden until opened.
- Naming: `walkthrough/<slug>.html` under the task root, or `teamspace/walkthroughs/<YYYYMMDD>-<slug>.html` standalone. The slug names the change, not the branch.

## Section contract

1. **Background** — teach what already exists, broad to narrow. Start where a newcomer to this subsystem would need to start (what it is for, who calls it, the normal path), then narrow to the exact context the change lands in. No detail of the change itself may appear before the reader can hold the old world in their head. Expand every in-task code (story IDs, finding IDs, internal artifact names) on first use, or better, do not use them.
2. **Intuition** — the essence of the change before any code. State the problem the change solves and the shape of the solution in plain language, then trace **one toy example end to end**: a concrete input, what the old code did with it, what the new code does, and why the difference is the point. Prefer a small figure with example data over prose where it is clearer.
3. **The change, as a story** — narrate the change in the order the *idea* unfolds: the pivotal decision first or the data-shape change first, whatever order makes each following step feel inevitable. Never file order, never alphabetical. Prose carries the reader between hunks: why this piece exists, what it enables next. Every hunk shown cites its real `path:line` anchor (from the actual diff — do not count lines by hand); hunks that carry no idea (renames, mechanical fallout) are summarized in one line each, with paths, not pasted.
4. **Behavior changes and risks** — a compact, complete account of what now behaves differently: new/changed outputs, error behavior, performance or compatibility effects, and — most valuable — interactions with pre-existing code paths the diff does not show. Write "none" for categories with none. Coverage is honest: anything in scope but not explained is listed here as explicitly not covered, with a reason.
5. **Quiz** — 5–8 multiple-choice questions, each with 3–4 options, answers hidden until the reader commits (HTML: click to reveal; md: `<details>`). Every option's reveal explains why it is right or wrong. Difficulty: substantive enough to require genuine understanding, no gotchas, no trivia.

## Quiz mechanics

- Target the surprise surface: behavior that depends on pre-existing code paths, edge cases and failure modes, "trace this input" questions, and "why was shape A chosen over B". At least one question must require knowledge from the **Background** section — that is how you detect a reader who skipped it.
- Forbidden: questions answerable by skimming the diff — file names, line counts, symbol spellings, counts of anything.
- Gate: as SKILL.md's "The quiz gate" (perfect score; a correct variant after the re-read clears a miss; `approved`/`skipped` in `task.md`'s Gate History). Standalone, the artifact ends with a final "Gate outcome: approved <date> / skipped by sponsor <date>" line.

## Pre-delivery self-check — if any item hits, go back and rewrite

- The first code block appears before the reader has been taught what the surrounding system does.
- Sections 3's ordering mirrors `git diff --stat` output rather than the idea's structure.
- A shown hunk has no `path:line` anchor, or an anchor was estimated rather than taken from the diff.
- A behavior change you know about appears in neither section 4 nor the not-covered list.
- Any quiz question is answerable without reading the artifact (trivia), or none requires the Background section.
- The artifact depends on network resources, external fonts, or a renderer the sponsor may not have.
- The walkthrough was delivered inline in the terminal instead of persisted to a file.
- An unexplained in-task code (T-xx, F-xx, ST, internal artifact name) appears anywhere.
