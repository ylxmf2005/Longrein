---
artifact_type: PhaseAssignment
task_id: 20260603-120000-example-task
task_root: teamspace/tasks/20260603-120000-example-task/
from_agent: delivery-orchestrator
to_agent: project-steward-reviewer
phase: code-review
status: assigned
output_path: review/specialist-findings/project-steward-reviewer.md
---

# Assignment: code-review

## Goal

以项目 steward / maintainer 的视角，review 这个 plan、design 或 diff 是否值得被纳入项目的长期历史。

## Inputs

- implementation/implementation-story.md
- implementation/implementation-result.md
- review/code-review.md
- git diff 或变更文件列表

## Source artifacts

- requirements/validated-requirements.md

## Constraints

- 供人阅读的输出使用 zh-CN。
- 只报告对长期维护有影响、可定位且可执行的问题。
- 不要把个人风格偏好包装成 blocker。

## Required outputs

- 将 phase artifact 写入 `output_path`。
- 返回一份与 `templates/phase-receipt.demo.md` 匹配的 receipt。

## Stop conditions

- 所需输入缺失、目标不明确，或 review 范围无法确定。
