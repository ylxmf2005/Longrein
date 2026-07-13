# 在 Codex 上运行 AgentCorp

[← 返回 README](../README_CN.md) · [English](codex-setup.md)

## 安装

```
codex plugin marketplace add ylxmf2005/AgentCorp
```

启动 Codex，在 `/plugins` 菜单启用 **AgentCorp** 并重启。

单独安装某个技能（不装整个插件）：

```
use skill-installer to install the skill at repo ylxmf2005/AgentCorp path agentcorp/delivery-orchestrator
```

## 生命周期 hook

Codex 没有 `SessionEnd` 事件，插件的生命周期 hook 在 Codex 侧挂载方式不同：把 `hooks/codex-hooks.json` 拷贝或合并进 `<repo>/.codex/hooks.json`（或 `~/.codex/hooks.json`），并把 `AGENTCORP_PLUGIN_ROOT` 改成本仓库路径。

两个运行时共用同一批脚本。在 Codex 上，skill-evolution 的 capture 通过 `Stop` hook 逐 turn 记录状态，下次会话启动时把闲置 30 分钟以上的会话扫进分析器。
