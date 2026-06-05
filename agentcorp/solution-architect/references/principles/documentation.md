# Documentation

## Description

Documentation quality is critical for maintainability. Comments capture design information that cannot be represented in code alone. Without proper documentation, developers waste time reconstructing original design intent, leading to slower modifications and increased risk of bugs. This dimension evaluates whether comments provide essential information at appropriate levels of detail, whether they describe non-obvious aspects effectively, and whether documentation supports rather than contaminates abstractions.

## Core Principles

### Comments Describe What Code Cannot

Code can only represent formal syntax and mechanics. It cannot express:
- The rationale behind design decisions
- High-level purpose and intent
- Invariants and preconditions
- Boundary condition semantics (inclusive vs exclusive ranges)
- When and why to use a particular interface
- Cross-module dependencies and coordination requirements

These elements exist in the designer's mind but disappear without documentation. Comments preserve this knowledge for future maintainers.

### Document at Different Levels of Detail

Effective comments provide information at a level different from the code itself:

**Lower-level precision**: Variable declarations, parameters, and return values need precise clarification. Specify units, boundary behavior, null semantics, ownership responsibilities, and invariants. A comment like "current offset" is too vague; "position of the first object not yet returned to the client" adds necessary precision.

**Higher-level abstraction**: Method and loop comments should describe intent, not mechanics. Instead of restating each line, explain what the code accomplishes as a whole and why it's needed. "Try to append the current key hash onto an existing RPC" is more valuable than describing each conditional test in a loop.

### Interface vs Implementation Documentation

Separate what users need to know from how things work internally:

**Interface comments** define abstractions. They describe a class's capabilities, a method's behavior from the caller's perspective, parameter requirements, return values, side effects, exceptions, and preconditions. Users should understand the abstraction without reading implementation code.

**Implementation comments** help maintainers understand internal workings. They explain what major code blocks accomplish and why specific approaches were taken. However, most simple methods need no implementation comments if the interface documentation and code are clear.

Interface documentation that reveals implementation details is a warning sign of shallow abstractions.

### Avoid Redundancy with Code

Comments that merely restate what the code obviously shows waste reader time and maintenance effort. If someone could write the comment by only looking at the adjacent code (without understanding the broader context), the comment adds no value.

Using the same words from method or variable names in comments is a common redundancy pattern. Instead of repeating names, provide additional information about meaning, constraints, or context.

### Write Comments During Design

Write interface comments before implementation code. This approach:
- Captures design reasoning while it's fresh
- Forces clear thinking about abstractions before coding
- Serves as a design tool for evaluating interface quality
- Prevents comment debt from accumulating

If a method or variable requires a long, complex comment to describe fully, that's a red flag indicating a problematic abstraction that should be reconsidered.

### Document Cross-Module Decisions

Design decisions that span multiple modules are particularly prone to bugs yet hard to document effectively. When dependencies cross boundaries, either:
- Place documentation in the obvious central location developers will encounter (like an enum where all values must be considered together)
- Maintain a central design notes file for complex cross-cutting concerns, with brief pointers from affected code locations

## Red Flags

### Missing Interface Documentation
- Public classes, methods, or significant variables without interface comments
- Method documentation that omits behavior description, parameter meanings, return value semantics, side effects, or exception conditions
- Assumption that code is self-documenting

### Repeating the Code
- Comments that paraphrase code line-by-line at the same level of detail
- Comments that only rearrange words from the entity name into a sentence
- No information in the comment that isn't immediately obvious from the declaration or statement

### Vague or Imprecise Documentation
- Variable comments missing units, boundary condition behavior, null semantics, or ownership
- Generic comments like "current offset" without specifying what makes it current or what it's an offset into
- Abstract descriptions without enough detail to use the interface correctly

### Implementation Details in Interface Comments
- Interface documentation describing internal data structures, algorithms, or implementation approaches
- Mixing "how it works internally" with "how to use it" in the same comment
- Exposing users to details they shouldn't depend on

### Outdated or Misleading Comments
- Comments contradicting actual code behavior
- Documentation describing old designs after code changes
- Comments placed far from the code they describe, making synchronization difficult

### Missing "Why" Explanations
- Tricky code without explanation of necessity
- Workarounds and special cases without rationale
- Non-obvious design decisions without recorded reasoning

### Inadequate Abstraction Documentation
- Users forced to read implementation code to understand how to use interfaces
- No documentation of what the overall abstraction represents
- Missing high-level conceptual framework for understanding the code's purpose

## Issue Tags

- **[Missing Documentation]**: Undocumented public interfaces, critical variables, or complex logic
- **[Redundant Comment]**: Comments that merely repeat what code already makes obvious
- **[Vague Documentation]**: Imprecise comments lacking necessary details for correct usage
- **[Implementation Leakage]**: Interface comments exposing internal details
- **[Outdated Comment]**: Documentation contradicting current code behavior
- **[Missing Rationale]**: Unexplained non-obvious design decisions or tricky code
- **[Poor Abstraction Documentation]**: Users cannot understand interface without reading implementation
