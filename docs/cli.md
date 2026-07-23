# CLI

Longrein CLI 只负责安装和维护 Skills、常驻规则与可选 Extension。

```text
longrein                         显示当前安装状态
longrein install [skill…]        选择并安装 Skills、常驻规则与可选 Extension
longrein update                  刷新过期副本并同步常驻规则
longrein uninstall [skill…]      移除指定 Skills
longrein uninstall --all         清理全部 Longrein Skills、规则、插件、marketplace 与旧集成
longrein status                  显示各 Skill 和常驻块状态
longrein list                    以纯文本列出可用 Skills
longrein doctor [--fix]          检查安装残留、过期副本、断链与损坏标记
longrein extension status        查看可选 Extension 状态
longrein extension install --dry-run 查看将执行的上游命令
longrein extension install -y    安装或更新可选 Extension
```

安装与维护命令支持 `--codex`、`--claude` 和 `--pi`。`install` 默认复制 Skills；开发 checkout 使用 `--link`。交互安装会选择宿主、Skills 与每个 Extension 组件。`install -y` 默认安装全部 Skills 并跳过 Extension；`--extensions` 选择全部组件，`--extension-components codegraph cass` 只选择指定组件。

Extension 编排 FastCtx、CodeGraph、cass 的官方安装渠道，并安装含 `coding-agent-session-search` 的 `longrein-extension` 插件。直接运行 `longrein extension install` 时可交互选择；脚本中把 `fastctx`、`codegraph`、`cass` 或 `cass-skill` 作为位置参数。它不会自动执行 `codegraph init`，也不会替 cass 下载语义模型。

`uninstall --all` 清理 Longrein 自己拥有的宿主足迹，包括 Pi 的 `~/.pi/agent/AGENTS.md` 规则块和本地插件登记。FastCtx、CodeGraph、cass 及其配置由各自上游拥有，不会被一并删除。

使用具体命令前运行 `longrein <command> --help`。
