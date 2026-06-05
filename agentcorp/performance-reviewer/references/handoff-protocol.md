# Shared Handoff Protocol

Use the demo templates in `templates/` instead of restating protocol text in each agent profile.

## Read Assignment

- Treat the assignment file as the task input.
- Resolve `output_path` relative to `task_root`.
- If `task_root` is absent, derive it from the assignment file location: the parent of the `handoffs/` directory.
- Write exactly one durable artifact at `output_path`.
- Return one receipt whose `artifact_path` matches `output_path`.

## Required Shapes

- Task record demo: `templates/task-record.demo.md`
- Manifest demo: `templates/task-manifest.demo.md`
- Assignment demo: `templates/phase-assignment.demo.md`
- Receipt demo: `templates/phase-receipt.demo.md`
- Acceptance package demo: `templates/acceptance-package.demo.md`
- Work item demo: `templates/work-item.demo.md`
- Validated requirements demo: `templates/validated-requirements.demo.md`
- Implementation Story Spec demo: `templates/implementation-story-spec.demo.md`
- TestPlan demo: `templates/test-plan.demo.md`
- Lightweight design note demo: `templates/lightweight-design-note.demo.md`
- Decision artifact demo: `templates/decision-artifact.demo.md`
- Finding-set artifact demo: `templates/finding-set.demo.md`
- Test-result artifact demo: `templates/test-result.demo.md`
