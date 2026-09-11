## Agent Notes 决策留痕

进行非平凡变更前，遵循 `write-notes-like-deepseek` Skill：检查并更新 `.agents/notes/` 中的既有决策；新构想先写 `proposed`，落地后转为 `implemented`，并与代码在同一提交中提交。Note 必须包含 `## Alternatives considered`，包括不做或复用已有方案的考量；核心入口保留指向 Note 的注释。完成后运行仓库提供的 Note 校验脚本。
