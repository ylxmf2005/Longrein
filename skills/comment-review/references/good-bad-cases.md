# 注释 Good/Bad Case

这些例子只用于判断注释价值，不是要求复制固定句式。实际措辞仍要以代码和项目 `AGENTS.md` 为准。

## Good Case

### 函数头说明行为，逻辑块给出阅读路标

```go
// Repath 将一个节点或目录子树移动到完整目标路径；目标重名时返回实际分配路径。
func Repath(ctx context.Context, req *RepathReq) (*RepathResp, error) {
    // 先解析 source 对应的完整子树，后续写入只处理这次解析出的记录。
    files, folders, err := listTreeRows(ctx, req.SourcePath)
    if err != nil {
        return nil, err
    }

    // File 记录路径变化历史；Folder 没有内容历史，只更新 path metadata。
    return repathRows(ctx, files, folders, req.TargetPath)
}
```

函数头给调用者可观察行为，内部注释把读者带过两个不同业务阶段；它们都不是把函数名或语句翻译成中文。

### 先说明无效请求不会进入数据库

```go
// 请求缺少必要字段时直接返回，避免把不完整资产写入数据库。
if req.FileID == "" {
    return nil, bizerr.ErrInvalidArgument
}
```

这里解释了校验的业务后果，而不是复述 `FileID == ""` 的语法。

### 外部调用前说明目的，失败分支说明补偿

```go
// 查询最新版本，用于判断资产是否仍指向当前文件内容。
version, err := l.fileRepo.GetLatestVersion(ctx, fileID)
if err != nil {
    // 版本查询失败时无法确认引用关系，拒绝继续写入，避免产生无法追踪的资产记录。
    return nil, bizerr.ErrInternal.Wrapf(err, "get latest file version")
}
```

注释分别交代调用目的和错误策略；错误包装仍保留给日志/堆栈，接口不直接暴露底层细节。

### 复杂筛选说明权限和数据边界

```go
// 分享来源只允许返回公开文件信息，避免把 owner 或 Project 上下文泄露给分享方。
if source == SourceShare {
    asset.ProjectID = nil
    asset.SessionID = nil
}
```

注释解释了“为什么清理字段”，而不是重复“把字段设为 nil”。

## Bad Case

### 把开发过程和内部标签写进代码

```go
// ponytail: 这里只有一次写，先不加锁；真实并发出现后再增加 guard。
folderPath, err := allocatePath(ctx, requestedPath)
```

这条注释泄露了审查标签、当前作者的取舍过程和未落地方案，却没有说明当前调用的业务目的。若这里没有可证实的运行时边界，直接删除；若代码确实依赖当前约束，只写由代码或权威契约证明的约束与后果。

### 把注释写成 changelog

```go
// Total 延续现有契约，只统计普通 File。
// 先按旧逻辑加入 File，保持 master 的节点顺序。
```

读者必须知道旧版本和 diff 才能理解这些话。改成独立成立的当前事实：

```go
// Total 只统计普通 File，不统计目录节点。
// 先加入 File，避免后补的空目录改变 File 节点顺序。
```

### 记录未合入方案或 Prompt 结论

```go
// 用户说 Tree 操作不会并发，所以这里先不做 CAS。
// 后面可以加 namespace cache 优化全量扫描。
```

用户 Prompt、备选设计和未来计划不属于产品代码。若“不并发”是当前必须满足的调用契约，应在权威契约中固定并由代码引用；若尚未成立，交给 Shape/Review，不要用注释把讨论写成事实。性能候选进入 issue、设计或性能任务，不留在普通代码注释中。

### 逐字复述代码

```go
count += 1 // 将 count 加 1
```

读者已经能从代码得出这个事实；注释没有提供意图、边界或后果。

### 函数头掩盖复杂内部逻辑

```go
// Create 创建 Plan。
func (l *planLogic) Create(...) error {
    // 分配资源、调用外部服务、持久化记录和失败释放都没有说明。
}
```

如果内部有多个独立业务阶段，一句函数摘要不能替代这些逻辑块的意图和错误策略。

### 泛化口号或无证据承诺

```go
// 统一处理筛选枚举，避免普通情况出错。
normalizeCategory(category)

// 防止并发问题。
save(ctx, item)
```

前一句没有说明具体边界，后一句声称存在并发保护但代码没有对应机制。应回到真实条件、锁/事务/唯一键或删除无效注释。

### 借补注释改动未修改代码

本轮只修复一个 handler 的返回字段，却顺手给同文件几十个未触及函数补齐注释或重排代码。这扩大了 diff，降低审查可见性，也把旧代码的责任混入当前任务。

### 用注释掩盖错误处理

```go
// 释放资源失败可以忽略。
_ = l.pool.Release(ctx, pod)
```

除非项目契约明确规定并且有可追踪记录，这既没有处理错误，也没有给排障留下日志。注释不能替代错误处理；best-effort 失败至少应按项目规则记录 Warn。
