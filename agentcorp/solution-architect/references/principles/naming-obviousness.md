# Naming & Obviousness

## Description

Code should be immediately understandable. When developers read code, their first quick guess about what it does should be correct, without needing deep analysis or constant reference to documentation. This dimension evaluates whether code makes its meaning clear through precise naming, adherence to conventions, and alignment with reader expectations.

Obscurity is a primary cause of complexity. When important information is hidden or requires effort to discover, developers waste time, make incorrect assumptions, and introduce bugs. Good naming is foundational — names create mental images that guide understanding. Consistency amplifies this by allowing developers to transfer knowledge from one context to another. When code violates expectations or uses ambiguous constructs, it forces readers to slow down and puzzle out the true behavior.

This review dimension asks: Can someone read this code quickly and understand it correctly on the first pass? Or does it require careful study to decode?

## Core Principles

### 1. Choose Precise Names

Names should create clear mental images of what they represent. Precision means the name narrows down the possibilities — when someone sees the name in isolation, they can accurately guess what it refers to without seeing documentation or usage context.

- Generic names like `count`, `data`, `info`, `status` are usually too vague
- Names should distinguish between similar concepts (e.g., `fileBlock` vs `diskBlock`, not just `block`)
- For booleans, use predicates that clearly indicate what true/false mean
- Avoid names that could reasonably refer to multiple different things
- When it's hard to find a precise name, that often signals unclear design

### 2. Use Names Consistently

Once a name is chosen for a particular purpose, use it everywhere for that purpose and never for anything else. Consistency reduces cognitive load — readers learn a pattern once and reuse that knowledge.

- Establish conventions for common concepts and follow them throughout
- Use the same name across the codebase for variables serving the same role
- Never reuse a name for different purposes in different contexts
- When multiple related variables are needed, add distinguishing prefixes (e.g., `srcFileBlock`, `dstFileBlock`)
- Conventions should be narrow enough that all uses have genuinely similar behavior

### 3. Maintain Consistency Across Code

Beyond names, consistency applies to structure, style, patterns, and invariants. Similar things should be done similarly; different things should look different.

- Follow existing coding style and structure when working in a file
- Use established design patterns and interfaces consistently
- Apply naming conventions uniformly (camelCase vs snake_case, loop variable conventions, etc.)
- Maintain invariants that reduce special-case reasoning
- Resist the urge to "improve" existing conventions unless the benefit justifies updating all usages

### 4. Make Code Match Expectations

Code is most obvious when it behaves as readers expect. Violating conventions or common patterns creates surprise and confusion.

- Operations should work as their names suggest
- Code structure should follow familiar patterns from the language/framework
- Unusual behavior (threads spawned in constructors, non-returning main functions) must be documented
- Standard library patterns and idioms should be preferred when they fit

### 5. Reduce Information Needed

The best way to make code obvious is to eliminate the need for hidden information. Design so that less context is required to understand behavior.

- Use abstraction to hide irrelevant details
- Eliminate special cases that require readers to track extra state
- Avoid constructs that obscure meaning (generic containers, mismatched declaration/allocation types)
- Design for ease of reading, not ease of writing

### 6. Present Critical Information Clearly

When information is essential, make it visible. Use formatting, comments, and structure to highlight what matters.

- Use whitespace to separate logical blocks and make structure scannable
- Add comments to explain non-obvious behavior (event handler invocation, unexpected control flow)
- Document when code violates normal expectations
- Ensure important information is where readers look for it

## Red Flags

### Imprecise Naming

- **Generic variable names**: `data`, `info`, `result` (in non-obvious contexts), `status`, `count` without qualification, `x`/`y` for non-coordinate concepts
- **Ambiguous names**: Single name used for multiple distinct purposes (e.g., `block` for both file blocks and disk blocks)
- **Overly specific names**: Names that suggest narrower usage than actual purpose (e.g., `selection` parameter for a method that works on any range)
- **Vague boolean names**: Boolean variables that don't clearly indicate what true/false mean (e.g., `blinkStatus` instead of `cursorVisible`)
- **Names that don't match behavior**: Method or variable name implies one thing, but actual behavior differs

### Naming Inconsistency

- **Same concept, different names**: Equivalent ideas called different things in different parts of the codebase
- **Same name, different meanings**: Reusing a common name for conceptually different things
- **Unpredictable conventions**: No pattern to how similar constructs are named
- **Breaking established patterns**: New code that ignores naming conventions visible in surrounding code

### Structural Inconsistency

- **Mixed coding styles**: Inconsistent indentation, brace placement, declaration ordering within the same codebase
- **Interface implementation variations**: Different implementations of the same interface using incompatible approaches
- **Varying patterns for similar operations**: Same problem solved differently each time
- **Violated invariants**: Properties that should always hold but are sometimes broken

### Code That Obscures Meaning

- **Event-driven callback registration without documentation**: Handlers with unclear invocation context
- **Generic containers for multi-value returns**: Using `Pair<Integer, Boolean>` instead of a specific type with meaningful field names
- **Mismatched declaration and allocation types**: Declaring `List` but allocating `ArrayList`, hiding actual behavior
- **Surprising control flow**: Code that doesn't exit when it looks like it should, or continues when it looks like it stops
- **Nonobvious side effects**: Operations that do more than their appearance suggests

### Missing Critical Information

- **Undocumented violations of expectations**: Unusual behavior not called out in comments
- **Dense formatting**: Code or documentation cramped together, making structure hard to parse
- **Lack of comments for complex logic**: Non-obvious algorithms or patterns without explanation
- **Hidden assumptions**: Code that depends on knowledge not visible at the point of use

### Hard-to-Name Entities

- **Difficulty finding a short, clear name**: Often indicates the entity doesn't have a clean single purpose
- **Names that require lengthy qualification**: Suggests trying to do too much in one place
- **Multiple reasonable interpretations**: Name could mean several different things with equal probability

## Issue Tags

Use these tags in code review output:

- **[Vague Name]**: Name too generic to convey meaning (e.g., `data`, `info`, `status`)
- **[Ambiguous Name]**: Name used for multiple distinct purposes or could mean several things
- **[Inconsistent Naming]**: Same concept named differently across the codebase or same name reused for different concepts
- **[Naming Convention Violation]**: Code breaks established naming patterns in the project
- **[Style Inconsistency]**: Code doesn't match the formatting/structure conventions in surrounding files
- **[Pattern Inconsistency]**: Similar problems solved with different approaches without justification
- **[Nonobvious Code]**: Code behavior isn't clear from a quick reading; important information is hidden
- **[Generic Container Abuse]**: Using `Pair` or similar generic types where a specific type would clarify meaning
- **[Violates Expectations]**: Code behaves differently than readers would naturally expect
- **[Undocumented Surprise]**: Unusual behavior (threads, non-returning, side effects) not explained in comments
- **[Poor Information Layout]**: Dense formatting or unclear structure makes code hard to scan
- **[Hard-to-Name Entity]**: Difficulty choosing a precise name signals unclear design of the underlying entity
