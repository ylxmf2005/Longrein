---
artifact_type: SpecialistReviewFindingSet
task_id: 20260611-120000-example-task
author_agent: change-hygiene-reviewer
status: completed
source_artifacts:
  - path/to/reviewed-diff.md
---

# 变更卫生审查发现

## 结论

- 裁定：clean | minor_noise | needs_cleanup | needs_human_intent
- 摘要：

## 审查范围

- 差异：
- 源制品：
- 已加载参考：diff-noise.md | scope-residue.md | 均未加载（说明原因）

## 机械扫描

- 命令：
- 裁定：
- 噪音比例：
- 类别：
- 当未加载 `diff-noise.md` 时，写“未运行”并说明原因。

## 意图追溯

| 变更 | 源制品 | 必要性 | 兼容性影响 | 裁定 |
| --- | --- | --- | --- | --- |
| path/to/file:line | 需求 / story / 契约 / 诊断 / 审查发现 / 测试失败 / 用户指令 / 工具要求 / 无 | 必需 / 可选 / 未知 | 无 / 已变更 / 未知 | 保留 / 移除 / 拆分 / 请求人工 |

## 发现

### 发现 1：<标题>

- 严重度：
- 置信度：
- 类别：diff-noise | scope-residue | intent-trace-gap | contract-drift | mixed
- 证据：
- 影响：
- 推荐：

## 其他车道目击

- 本审查者问题之外的真实问题（疑似缺陷、安全气味、性能风险）——永不展开，永不遗漏。若无则写“无”。

## 值得保留的机械变更

- 若无则写“无”。

## 需要发起人确认的意图

- 若无则写“无”。

## 证据缺口

- 若无则写“无”。

## 残留风险

- 若无则写“无”。
