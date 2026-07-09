---
artifact_type: FixRecordSet
task_id: 20260603-120000-example-task
author_agent: review-fixer
status: completed
group_slug: <本组的短英文标识，通常由授权文件集派生>
source_artifacts:
  - review/research/00-index.md
---

# 修复记录，逐条：<group_slug>

本组的授权文件集（OWNED_FILES）：path/to/service.py, path/to/helper.py

## 逐条记录

### 记录 1

- fix_item_id: <来自 review/research/ 的 ID，例如 F-01>
- severity: <P0 | P1 | P2>
- verdict: fixed-as-suggested
- files_changed: path/to/service.py, path/to/test_service_regression.py（新建测试文件，仅由本组创建）
- regression_check: 在 path/to/test_service_regression.py 中新增 <测试/检查>；在 <触发条件> 下修复前失败、修复后通过。
- notes: 漂移检查通过；按研究修复方案在根因处落地，未降级为补丁。

### 记录 2

- fix_item_id: <来自 review/research/ 的 ID，例如 F-04>
- severity: <P0 | P1 | P2>
- verdict: needs-research
- files_changed: none
- regression_check: not applicable
- escalation: 研究的建议与当前代码不匹配——<不匹配之处：代码已变 / 不适用 / 与现有代码冲突>。未在其上叠加自己的替代方案；退回 review-researcher 重新检查。
