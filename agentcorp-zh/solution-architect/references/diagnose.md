---
id: diagnose
name: Bug Diagnosis
inputs: [validated requirements (bug report), reproduction steps if available]
outputs: [diagnosis design artifact]
optional: true  # 仅在任务需要此产出类型时生成——选择由 SKILL.md "Your outputs" 控制
---

# 缺陷诊断

在设计任何修复之前，先用证据锁定缺陷的根因。核心纪律是：每个调查步骤从一个清晰、可证伪的假设开始，以确认或推翻它的证据结束。当你发现自己没有假设就四处试探时，停下来先设一个。

## 你做什么

把假设磨到"足够具体以被证伪"——例如，"密码更改后 session token 没有刷新，所以旧 token 仍然有效"，而不是"auth 里有点不对劲"。用真实代码与真实行为验证它。如果成立，你得到了根因；如果不成立，这个结果本身就是证据——收集更多线索（线索用尽时给代码添加埋点），然后设定下一个假设。

保持验证廉价且真实：使用能真正确认或推翻的最小手段，绝不要用 fake 返回值或 mock 替代你正在解释的真实行为。区分 proximate cause（这行代码错了）与 root cause（数据模型从未考虑这个 case）——修复 targeting 根因。

## 这份产出必须达成什么

阅读后，读者应相信你找到了真正的根因，且修复是 targeting 它的最小改动。它必须清楚说明：

- 缺陷是什么；
- 你验证了哪些假设，每个附证据与结论；
- 根因——与表面症状区分，并由证据支撑；
- 修复它的最小改动，以及触及哪些文件；
- 回归风险——此修复可能扰动什么。

仅在视图比文字更清楚地表达"故障路径 vs. 修正路径"时绘制图表。

如果修复最终触及多个模块、改变现有行为或改动接口，不要让诊断承载整个设计：把根因与回归标准保留在诊断中，然后附加 `impact-analysis.md` 说明落在哪里与哪些行为必须保留；当涉及公共/共享或跨模块边界时，再附加 `interface-contract.md`。

## 产出

将产出写到任务分配的 `output_path`（通常是 `design/diagnosis.md`），遵循 `design-artifact` demo 模板。
