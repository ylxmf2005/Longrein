# Requirements 产物 Demo

`shape/requirements.md` 展开 `context.md` 中的任务承诺，不复制 Goal、Scope 或 Non-goals。只保留当前任务真实需要的章节。

```markdown
# Requirements：<任务或能力>

## 来源与状态
- 实际对象与版本：<代码、系统或运行现场>
- 用户承诺：`../context.md`
- 可信状态：ready | needs_evidence | needs_decision

## 用户结果与问题
<谁在什么情境下需要什么可观察结果，当前差距是什么。>

## 详细需求
| ID | 必须成立的行为 | 来源 | 观察入口 |
| --- | --- | --- | --- |
| REQ-001 | <行为或边界> | <当前承诺、事实或证据> | <判断成立的表面> |

## 必须保持与范围外
<引用 `context.md` 的 Scope、Non-goals 和现有契约，不发明新承诺。>

## 会改变设计的开放问题
<问题、所需证据或用户决定，以及受影响的 REQ；没有真实问题时省略。>
```
