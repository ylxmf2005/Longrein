# Worked examples — what earns a comment

Load when calibrating what earns a comment, what to cut, and what counts as falsified.

Good — carries a boundary the code cannot show:

```java
// Save-time rejects dirty configs; runtime still fail-opens to avoid missed alarms from legacy data.
validateEffectiveTime(policy);
```

Good — records legacy semantics a reader would otherwise break:

```go
// Empty preset is a legacy fail-open shape; clear the group to preserve "always active" semantics.
clearEffectiveTime(monitor)
```

Poor — repeats the call, lists fields that will drift, gives a generic reason:

```java
// This calls validateEffectiveTime to validate effectiveTimeMode, effectiveTimeCustom,
// and effectiveTimePreset so bad user input does not cause save failure or runtime errors.
validateEffectiveTime(policy);
```

Poor — the assertion already says non-null; keep only if the non-null preset is a surprising public contract:

```java
// ALWAYS goes through canonicalize's default preset, so response preset is non-null.
assertNotNull(vo.getEffectiveTimePreset());
```

Poor and dangerous — the diff just added a call path that skips `canonicalize()`, falsifying the comment. A wrong comment is worse than none; flag it with the falsifying path as evidence:

```java
// effectiveTime is never null here; canonicalize() always fills the default preset.
applyEffectiveTime(policy.getEffectiveTime());
```
