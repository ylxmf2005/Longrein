# Diff Noise Review

仅在任务或 diff 信号指向空白符、格式化、换行、注释、顺手重构或 formatter 波及范围时加载。目标是找出那些没有行为价值、不是工具强制要求、却膨胀 MR/PR 阅读成本的 hunk。

## 流程

1. 先跑机械扫描——在正确的 repo 里、对着正确的范围。
   - 从被 review 代码的 worktree 根目录运行扫描器（任务使用独立 checkout 时即 `code_worktree`/`code_location`）：`python3 <本 skill 的绝对路径>/scripts/diff_noise_scanner.py --json --base <target-branch>`。该脚本在你当前工作目录里调用 `git diff`，所以必须在被 review 的 repo 内运行——如果从 skill 目录运行，你扫描的就是 skill 仓库，而不是代码。
   - Review MR/PR 或 feature branch 时，优先使用 assignment 指定的 base/head。没有显式范围但能找到目标分支时，用 `--base <target-branch>`——脚本会自己计算 merge-base(base, HEAD)。要用原始 range 时，用三点形式 `--diff <base>...HEAD`；两点的 `<base>..HEAD` 对比的是 base **分支尖端**和 HEAD，会把主线上不在 HEAD 里的 commit 以反向 hunk 拖进来，让你把别人已合入的改动当成本次 MR 的噪音上报。
   - 仅当发起方或 assignment 明确要求 review staged / worktree / current candidate 时，才看本地未提交变更：不带 source 标志时脚本扫描 staged diff，`--worktree` 扫描未 staged 的 worktree。注意：不带 source 标志且 staged diff 为空时，脚本会**静默回退到未 staged 的 worktree diff**——此时输出的 `source` 字段是 `git diff (fallback; staged diff was empty)`。在 MR/PR 场景下永远显式传 `--base`/`--diff`/`--file`，并且在使用任何 finding 前，永远核对 `source` 与你被指派的范围一致。
   - 外部 diff 文件用 `--file <diff-file>`。
   - 需要先逐块浏览 compare diff 时，用 `--base <target-branch> --chunks hunk|group|line`；`group` 指同一个 hunk 内连续 `+/-` 的改动段，最适合逐段判断每段是否属于本次 change。
   - 调整 chunk 大小可用 `--unified 0` 把上下文拆得更细，或用 `--inter-hunk-context <n>` 合并相邻 hunk。
   - 将输出的 `verdict`、`counts_by_category` 和关键发现当作证据；该脚本是证据收集器，不是最终裁判。
2. 确定 change surface。
   - 优先使用 assignment 给出的 base/head 或 diff 文件。在 MR/PR 场景下，未提交的 worktree 默认只是本地状态，不是 MR/PR 的 diff。
   - 若 assignment 未给范围，先从目标分支确立 merge-base..HEAD；只有在任务明确要求「review staged/worktree/current candidate」时，才切换到 staged 或 worktree diff。
   - 阅读 `git diff --stat`、`git diff --name-status` 和 `git diff -- <path>` 查看关键文件。
   - 对怀疑为空白符噪音的 hunk，用 `git diff -w -- <path>` 或 `git diff --ignore-space-change -- <path>` 对比。
3. 先分类，再判断。
   - `semantic`：与行为、contract、数据、错误处理以及实现任务所需的测试更新。
   - `mechanical-required`：项目 formatter/linter 必须产生的最小格式化变更。
   - `noise`：不改变行为、不是工具强制要求、且增加阅读成本。
   - `mixed`：单个 hunk 混入了 semantics 和 noise；建议拆分 hunk 或 revert noise 行。
4. 对每个 noise/mixed hunk 问三个问题。
   - 这个 requirement、Story Spec、review finding 或 test failure 是否要求它？
   - 项目 formatter/linter 是否显式要求它？
   - 如果删掉这些行，行为、verification 和 lint 是否仍然成立？

## 重点关注的问题

- **纯空白符改动**：忽略空白符后 hunk 消失，且 formatter/linter 不要求。
- **过度换行**：函数调用、字面量、方法链、列表或断言被不必要地拆窄，而原始代码并未超出项目可接受的行宽。
- **理由不足的 reflow**：docstring、注释、字符串、错误信息或日志文本仅被重新排序或重新换行。
- **顺手格式化**：附近函数、未触碰分支、无关 import 或已有测试被顺带重排格式。
- **顺手重构**：把仅被一处调用的逻辑提取成函数、合并/拆分函数、重命名或重排代码块，而任务并不需要。
- **纯注释噪音**：改写措辞、添加解释性注释，或在没有纠正过时/错误信息的情况下删除注释。
- **生成代码或 formatter 波及范围**：一次 formatter 运行改了大批无关文件；建议收窄 formatter 范围或拆成单独的 MR/commit。

## 行宽与换行

不要把「更窄」当成「更好」。在 Python/backend 代码中，只要满足项目 lint/formatter 和周边文件风格，优先保持紧凑、可读、diff 小的形式。

在报告过度换行前，先确认至少满足以下条件之一：同一表达式只是被 model 拆到了多行；周边代码一般允许更宽的行；当前拆分制造了明显的噪音；或 `git diff -w`、手工 hunk 对比显示主要变更来自换行/缩进。

不要报告 formatter 必须拆分的长行、换行后明显提升可读性的复杂表达式，或为避免字符串/SQL/URL/类型签名过长而必须做的换行。

## 输出要求

只报告有可操作修复方案的 noise。对每条 finding，说明文件/行号或 hunk、scan 或 diff 命令证据（包括扫描器实际使用的 `source`）、它如何增加 review 成本，以及建议是 delete、revert、split the commit 还是 keep but explain。
