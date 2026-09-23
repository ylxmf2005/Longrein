---
name: writing-notes
description: 做出以后有人会问"为什么这样改"的技术决定时使用：选型、比较多个方案、架构调整、删减功能、复盘不显然的缺陷，或用户说"就用 X""为什么不用 Y"时；修改已有 Note 记录的模块时也使用。在 `.agents/notes/` 中新建、更新或取代决策记录。提交信息、changelog 和普通文档不用它。
---

# writing-notes

Note 是一份活的 ADR（Architecture Decision Record）：记下为什么这样做、放弃了什么、代价是什么，给下一个改这段代码的人（包括 Agent）先读。代码和提交记录说明做了什么，Note 负责它们说不清的理由和取舍。

## 什么时候写

问一句：以后还有人会问"为什么这样改"吗？会就写。选型、取舍、踩过的坑、很诱人但被否掉的方案都算；还没写代码的方案也可以先写成 proposed。只改格式、无歧义的重命名、不改行为的依赖升级不用写。

仓库已经有自己的决策记录（如 `docs/adr/`）时，写在那里并沿用它的格式。

## 先更新，再新建

动手前用模块名和机制名搜 `.agents/notes/`，找到记录这个模块的 Note。多数时候应该更新它：把路径、类名、默认值改成现在的样子，让它始终描述当前代码，而不是在末尾追加"某日更新"：读 Note 的人会把它当作现状。

新决定完全取代旧决定时，把旧 Note 里仍然有效的约束（安全边界、承诺不做的事、踩过的坑）搬进新 Note，再删掉旧 Note，或把它的状态改为 superseded 并链接到新 Note。同一件事只能有一篇 Note 给出当前说法。

被否掉的方案写进采纳方案的 Alternatives considered 就够了；只有它足够诱人、别人很可能再提时，才单独保留一篇 rejected。

## 写什么

文件放在 `.agents/notes/<首次写下的日期>-<主题>.md`：

```markdown
# <决定本身，如：会话存储用 SQLite，不用 JSONL>

Status: proposed | implemented | superseded by <链接> | rejected — <原因>

## Problem
什么问题、什么约束迫使要做决定；不看方案也能读懂。

## Decision
proposed 时写拟采用的方案和怎样算完成；implemented 时用现在时写已经落地的事实。

## Alternatives considered
每个真正考虑过的方案一段：先写它最有力的理由，再写为什么没选。包含"不做"或"复用已有能力"这一档。

## Consequences
收益和代价都写。简化类决定写明它的上限，以及出现什么信号时应该重新考虑。
```

说"更快""更稳"时给出对比基线，没有基线就只陈述事实。

## 让代码指回 Note

决定落地后，在受它约束的核心入口（公开接口、模块入口或状态机）留一行注释：

```ts
// Note: 会话存储为什么用 SQLite，见 .agents/notes/2026-08-23-session-store-sqlite.md
```

这行注释是下一个人发现 Note 的入口。决定被取代时，一起更新这些注释。
