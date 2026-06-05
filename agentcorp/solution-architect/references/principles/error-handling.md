# Error Handling

## Description

Error handling is a major source of complexity in software systems. This dimension examines how code deals with exceptional conditions — situations that disrupt normal program flow. Poor error handling leads to exception proliferation, where error-checking code scatters throughout the system, often exceeding the actual business logic in volume and complexity.

The goal is to **reduce the number of places where exceptions must be handled**, not to catch every possible error. Exception handling code is inherently harder to write, test, and maintain than normal-case code. It rarely executes in production, making bugs difficult to detect. Exception handling creates opportunities for more exceptions (e.g., recovery code that itself fails).

This review dimension focuses on whether error handling increases or decreases overall system complexity. The best code either eliminates error conditions entirely through careful API design, or handles exceptions at strategic points where they can be managed collectively.

## Core Principles

### 1. Define Errors Out of Existence

Redesign APIs so that exceptional conditions become normal cases with well-defined behavior. When semantics are adjusted properly, there's nothing exceptional to report.

- Operations should have natural outcomes for all inputs, not arbitrary restrictions
- "Ensure state X" is often better than "change to state X or fail"
- Allow operations to succeed trivially when their postcondition is already satisfied

### 2. Mask Exceptions at Low Levels

Handle exceptional conditions where they occur, preventing them from propagating upward. Low-level code that can fully resolve an exception should do so, making higher layers unaware of the problem.

- Retry mechanisms, redundant copies, and automatic recovery hide transient failures
- Deep modules absorb complexity by handling exceptions internally
- Exception masking pulls complexity downward into reusable infrastructure

### 3. Aggregate Exception Handling

When exceptions must propagate, catch many different exceptions at a single high-level point rather than scattering handlers throughout the code.

- Let exceptions bubble up to a level where they can be handled uniformly
- Generic handlers that dispatch based on exception content reduce duplication
- Top-level request handlers can catch all request-scoped exceptions in one place

### 4. Crash on Unrecoverable Errors

For errors that are impossible or impractical to handle, fail fast with clear diagnostics rather than adding complex recovery logic that may not work anyway.

- Out-of-memory, corrupted data structures, and catastrophic failures often cannot be fixed
- Attempting recovery from severe errors adds untested code that likely won't work
- Application-level crashes are acceptable for rare errors that offer no realistic recovery path

### 5. Avoid Defensive Over-Detection

Don't report exceptions for conditions that aren't actually problems. Many "errors" are artificial restrictions that complicate the API without providing value.

- Distinguish between conditions that prevent an operation from completing and conditions that are merely unexpected
- Exceptions are part of the interface; more exceptions mean shallower, more complex modules
- Throwing exceptions is easy, but handling them is hard — don't burden callers unnecessarily

### 6. Design Away Special Cases

Beyond exceptions, eliminate other special-case logic by making the general case handle edge conditions naturally.

- Empty collections, zero-length ranges, and null selections should work seamlessly with standard operations
- Internal representation doesn't need to mirror UI-visible concepts (e.g., "no selection" vs. empty selection)
- Code riddled with `if` checks for special cases indicates design that could be simplified

## Red Flags

### Exception Proliferation

- **Individual exception handlers for each call**: Wrapping every risky operation in its own try-catch block, creating visual clutter and code duplication.
- **API throws numerous exception types**: Classes that declare many different exceptions have complex, shallow interfaces.
- **Exception cascades**: Exception handlers that can themselves throw exceptions, creating multi-level error handling chains.
- **Duplicate exception handling logic**: Same error-handling pattern repeated across multiple call sites.

### Poor Exception Placement

- **Punting exceptions upward without added context**: Low-level code throws exceptions for conditions it doesn't know how to handle, forcing every caller to deal with them.
- **Exposing implementation details via exceptions**: Exceptions leak internal structure (e.g., database-specific errors in API responses).
- **Exceptions for conditions that don't need reporting**: Throwing errors when operations already accomplished their goal or when the "error" is a harmless edge case.

### Artificial Error Conditions

- **Overly strict preconditions**: Operations fail on inputs they could easily handle (e.g., deleting a nonexistent item, substring with out-of-range indices).
- **Exceptions that indicate missing design thought**: "I don't know what to do here, so I'll throw an exception and make it the caller's problem."
- **Reporting errors for already-satisfied postconditions**: Treating success as failure when the desired end state is already achieved.

### Untestable Error Handling

- **Exception paths that can't be easily triggered**: Error handling code for rare conditions (I/O failures, network timeouts) that isn't exercised by tests.
- **Commented-out or empty catch blocks**: Indicates exceptions were encountered but never properly addressed.
- **Lack of clarity on exception sources**: Long try blocks where it's unclear which line might throw which exception.

### Special-Case Proliferation

- **State variables tracking whether special cases exist**: Explicit flags for "no selection", "empty list", etc., leading to checks throughout the code.
- **if-else chains handling variants of the same operation**: Separate logic paths for subtly different scenarios that could share a general implementation.
- **Different codepaths for normal and edge cases**: Edge cases handled with entirely separate logic instead of falling through the general case.

## Issue Tags

Use these tags in code review output:

- **[Exception Proliferation]**: Too many exception handlers or exception types, increasing interface complexity
- **[Error Definition]**: Operation throws exceptions for conditions that could be defined as normal behavior
- **[Exception Masking Opportunity]**: Low-level exception that could be handled internally rather than exposed
- **[Exception Aggregation]**: Multiple similar handlers that should be consolidated at a higher level
- **[Unrecoverable Error Handling]**: Complex recovery logic for errors where crashing would be simpler and safer
- **[Defensive Over-Detection]**: Reporting errors for conditions that aren't actually problems
- **[Special Case Complexity]**: Explicit handling of cases that could be absorbed by general logic
- **[Information Leakage via Exception]**: Exception exposes internal implementation details to callers
