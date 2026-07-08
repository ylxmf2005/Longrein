# 配置模式

可直接复制的模板。名称和命令要适配目标仓库已有的东西；绝不添加仓库没有对应工具的检查。所有模板都遵守 SKILL.md 的延迟预算：默认 hook 在一次典型 commit 上约 5 秒内完成。

## pre-commit —— `.pre-commit-config.yaml`

从小开始：通用检查，加上最多几条快速的 repo-local 命令。

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v5.0.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-merge-conflict
      - id: check-added-large-files
  - repo: local
    hooks:
      - id: quick-lint
        name: quick lint
        entry: make lint   # fast checks only here — never `make test` or the full suite
        language: system
        pass_filenames: false
```

安装并验证：

```sh
pre-commit install
pre-commit run --all-files
```

## Husky —— `.husky/pre-commit`（Node-first 仓库）

```sh
npx lint-staged
```

配合 `package.json` 中的 staged-file 检查：

```json
{
  "lint-staged": {
    "*.{js,ts,tsx}": "eslint --max-warnings 0"
  }
}
```

## Lefthook —— `lefthook.yml`（多语言 monorepo）

```yaml
pre-commit:
  parallel: true
  commands:
    lint-py:
      glob: "*.py"
      run: ruff check {staged_files}
    format-js:
      glob: "*.{js,ts}"
      run: npx prettier --check {staged_files}
```

## 可选 AI review guard 脚本

把 hook 接到脚本上；guard 要显式，只 review staged diff，并让 notes 远离 history：

```sh
#!/bin/sh
# Optional AI commit review — opt-in via AI_COMMIT_REVIEW=1.
# Bypass: SKIP=ai-commit-review git commit ...
if [ "${AI_COMMIT_REVIEW:-0}" != "1" ]; then
  echo "AI commit review skipped; set AI_COMMIT_REVIEW=1 to run it."
  exit 0
fi

notes_dir=".agentcorp/commit-review"
mkdir -p "$notes_dir"
grep -qxF "$notes_dir/" .gitignore 2>/dev/null || echo "$notes_dir/" >> .gitignore

git diff --cached > "$notes_dir/staged.diff"
# Invoke the CLI the user actually has — check `codex --help` / `claude --help` first.
# Print a one-line pass/fail summary to the terminal; write details under "$notes_dir/".
```

## 失败信息模式

每条约束都要打印失败项、为什么重要以及如何重跑：

```
merge-conflict-markers: found "<<<<<<<" in src/app.py.
Unresolved conflicts must never be committed. Fix the markers, then rerun:
  pre-commit run check-merge-conflict --all-files
```
