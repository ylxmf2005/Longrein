# 示例演练——什么配有一条注释

在校准什么配有一条注释、什么该删、什么算被证伪时加载。

推荐——承载了代码本身看不出的边界：

```java
// Save-time rejects dirty configs; runtime still fail-opens to avoid missed alarms from legacy data.
validateEffectiveTime(policy);
```

推荐——记录了读者否则会破坏的历史语义：

```go
// Empty preset is a legacy fail-open shape; clear the group to preserve "always active" semantics.
clearEffectiveTime(monitor)
```

不推荐——复述了调用、列了会漂移的字段、给了个太泛的原因：

```java
// This calls validateEffectiveTime to validate effectiveTimeMode, effectiveTimeCustom,
// and effectiveTimePreset so bad user input does not cause save failure or runtime errors.
validateEffectiveTime(policy);
```

不推荐——断言本身已经说了非空；只有当「非空 preset」是个出人意料的 public 契约时才留：

```java
// ALWAYS goes through canonicalize's default preset, so response preset is non-null.
assertNotNull(vo.getEffectiveTimePreset());
```

不推荐且危险——这个 diff 刚加了一条绕过 `canonicalize()` 的调用路径，把这条注释证伪了。一条写错的注释比没有更糟；把证伪它的那条路径附上作证据，报出来：

```java
// effectiveTime is never null here; canonicalize() always fills the default preset.
applyEffectiveTime(policy.getEffectiveTime());
```
