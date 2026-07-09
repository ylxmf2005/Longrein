# 配置模式

即拷即用的模板。根据目标仓库已有的内容调整名称和命令；绝不要添加仓库没有工具的 check。每条模板遵守 SKILL.md 的延迟预算：默认 hook 在典型提交中在约 5 秒内完成。

## pre-commit —— `.pre-commit-config.yaml`

从小开始：通用检查加最多几个快速的本地仓库命令。

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
        entry: make lint   # 此处仅快速检查——绝不用 `make test` 或完整套件
        language: system
        pass_filenames: false
```

安装并验证：

```sh
pre-commit install
pre-commit run --all-files
```

## Husky —— `.husky/pre-commit`（Node 优先的仓库）

```sh
npx lint-staged
```

在 `package.json` 中配置暂存文件检查：

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

## 可选 AI 审查守卫脚本

将 hook 接入脚本；保持守卫显式，仅审查暂存 diff，并让注释不进入历史：

```sh
#!/bin/sh
# 可选 AI 提交审查——通过 AI_COMMIT_REVIEW=1 可选启用。
# 绕过：SKIP=ai-commit-review git commit ...
if [ "${AI_COMMIT_REVIEW:-0}" != "1" ]; then
  echo "AI commit review skipped; set AI_COMMIT_REVIEW=1 to run it."
  exit 0
fi

notes_dir=".agentcorp/commit-review"
mkdir -p "$notes_dir"
grep -qxF "$notes_dir/" .gitignore 2>/dev/null || echo "$notes_dir/" >> .gitignore

git diff --cached > "$notes_dir/staged.diff"
# 调用用户实际拥有的 CLI——先检查 `codex --help` / `claude --help`。
# 向终端打印单行通过/失败摘要；将详情写入 "$notes_dir/" 下。
```

## 失败消息模式

每条约束打印什么失败、为什么重要以及如何重新运行：

```
merge-conflict-markers: found "<<<<<<<" in src/app.py.
Unresolved conflicts must never be committed. Fix the markers, then rerun:
  pre-commit run check-merge-conflict --all-files
```
