# Evolution 产物 Demo

这份文件是 `evolution/evolution.md` 或独立研究时 `studio/evolution/<YYYYMMDD>-<slug>.md` 的唯一结构来源。没有可复用经验时不创建产物。

```markdown
# Evolution：<准备改变的长期行为>

## 真实行为偏差

- 触发：<什么真实输入或工作条件触发了偏差>
- 实际行为：<Agent、Skill、规则或工具怎样表现>
- 后果：<用户介入、错误、遗漏、成本或长期副作用>
- 证据：<真实轨迹、文件、输出或反馈>

## 准备改变的未来行为

<同类任务未来应怎样不同，以及什么不应改变。>

## 作用域与失效条件

- 最窄作用域：<Task、项目规则、Skill、工具或其他>
- 相邻能力：<可能重叠或冲突的 Skill/规则及检查结果>
- 失效条件：<什么变化会让这项经验不再适用>

## 候选变化与授权

- 变化范围：<准备修改的文件、结构或行为契约>
- 用户授权：<批准的具体范围或 diff；未批准时写 pending>
- 不在范围内：<不会借本轮改变什么>

## 前后证据

| 轨迹或检查 | 修改前 | 修改后 | 结论 |
| --- | --- | --- | --- |
| <原失败、成功样本或相邻反例> | <行为> | <行为> | improved \| unchanged \| regressed \| not-run |

## 当前状态

- 落地状态：candidate | modified | static-verified | behavior-verified
- 已确认：<证据实际支持的结论>
- 尚未证明：<没有行为重放时明确写出>
- 下一位：<owner、dev、review、test 或其他>
```
