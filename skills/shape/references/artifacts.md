# 产物与权威来源

Shape 的目标是让任务承诺在 `context.md` 中成立，并把需要展开的方向写成可交接的专业产物，让下一位只从 `context.md` 就能找到当前有效的来源。契约组合由任务终点和真实消费者决定，不用额外文件表演完整。

让表达服从读者需要完成的判断：面向用户先建立必要背景、因果和取舍，面向专业消费者固定可引用的精确关系。专业模板不替代共同理解。

## 选择产物

- 新任务先创建根目录 `context.md`；尚未取得用户承诺的 Goal、Scope 和 Non-goals 保持未决。
- 根因需要独立交接时创建 `shape/diagnosis.md`。
- 准备进入非平凡实现、且需求和系统模型需要被不同工作引用时，创建 `shape/requirements.md`、`shape/design.md` 和任务根目录 `plan.md`。
- 公共或跨模块契约需要独立评审和持续修订时创建 `shape/contract.md`，Design 只链接它。
- 迁移、混合版本、不可逆点和退出路线需要独立判断时创建 `shape/migration.md`，Plan 只安排执行。
- 结论依赖可重放调查、复现或运行输出时，把材料放入 `shape/evidence/`，正文解释它证明什么和不能证明什么。

诊断终点不为了形式创建 Requirements、Design 或 Plan。局部且结构清楚的行动也可以直接交给 `dev`，不制造文档套件。

## 保持唯一权威来源

`context.md` 拥有用户原始请求、现实坐标、当前任务承诺与当前产物入口；其中的 Current Artifacts 只列仍然有效的路径，不复制专业结论。Requirements 拥有详细可观察需求；Contract 拥有需要独立修订的精确公共关系；Design 拥有对任务承诺的当前技术回答；Migration 拥有迁移与退出关系；Plan 拥有当前路线、依赖和简短证据入口。其他文件引用这些来源，不复制正文。

模板是结构的唯一来源，正文和其他 reference 只定义判断责任：

- [Context Demo](templates/context.demo.md)
- [Requirements Demo](templates/requirements.demo.md)
- [Design Demo](templates/design.demo.md)
- [Plan Demo](templates/plan.demo.md)
- [Diagnosis Demo](templates/diagnosis.demo.md)
- [Contract Demo](templates/contract.demo.md)
- [Migration Demo](templates/migration.demo.md)

模板中的可选章节可以省略。某个高风险变化面经实际调查确认不适用时，记录检查依据；未调查的部分保持未知，不用 `none` 把它伪装成不存在。
