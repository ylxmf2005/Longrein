# Cohesion & Separation

## Description

This dimension addresses one of the most fundamental design questions: should two pieces of functionality be implemented together or kept separate? This decision applies at all levels — functions, methods, classes, modules, and services. The goal is to minimize overall system complexity by making informed together-or-apart choices that improve information hiding, reduce dependencies, and create deeper interfaces.

Key concerns include:
- **Together-or-apart decisions**: Whether related functionality should be combined or separated
- **Code repetition**: Duplicated code patterns that signal missing abstractions
- **General-special mixing**: General-purpose mechanisms contaminated with special-purpose logic
- **Conjoined methods**: Code pieces that cannot be understood independently

## Core Principles

### Subdivision Creates Its Own Complexity

Breaking systems into smaller pieces isn't automatically better. Subdivision introduces costs:
- More components to track and manage
- Additional interfaces between components
- Potential code duplication across components
- Physical separation that makes dependencies harder to see
- Management overhead for coordinating multiple pieces

These costs only pay off if subdivision genuinely reduces complexity by enabling better information hiding and clearer abstractions.

### Bring Together When Related

Code pieces belong together if they are genuinely related through:
- **Shared information**: Both depend on the same knowledge (e.g., document format, protocol structure)
- **Bidirectional usage**: Users of one will almost always use the other
- **Conceptual overlap**: They fall under a natural higher-level category
- **Understanding dependencies**: One cannot be understood without the other

### Bring Together to Simplify Interfaces

Combining modules can eliminate intermediate interfaces and enable automatic handling of cross-cutting concerns. When partial solutions are merged, the combined interface is often simpler than the sum of the original interfaces, and some functionality can be handled transparently.

**Example**: Combining file I/O with buffering eliminates the need for users to understand or configure buffering — it just works by default.

### Bring Together to Eliminate Duplication

Repeated code patterns indicate missing abstractions. When the same logic appears in multiple places, consider:
- Extracting common code into a shared method (if the pattern is substantial and has a simple interface)
- Refactoring to execute the code in only one place
- Whether shallow extractions (one-line methods with complex signatures) add more complexity than they remove

### Separate General-Purpose from Special-Purpose Code

General-purpose mechanisms should not contain special-purpose logic for particular use cases. Mixing them creates:
- More complex mechanisms that are harder to understand
- Information leakage between the mechanism and specific use cases
- Fragility where changes to one use case require modifying the general mechanism

**Solution**: Pull special-purpose code upward into higher layers, keeping lower layers general-purpose. Upper layers typically handle application-specific logic, while lower layers provide reusable infrastructure.

### Split Methods for Cleaner Abstractions, Not Length

Method length alone is not a good reason to split. Long methods with simple interfaces can be deep and good. Only split methods when it produces cleaner abstractions:

1. **Extract a subtask** (parent-child split): The child method implements a cleanly separable subtask that is relatively general-purpose. Readers should understand the child without knowing the parent, and vice versa.

2. **Divide complex functionality** (sibling split): The original method tried to do multiple unrelated things with an overly complex interface. Each resulting method should have a simpler interface, and most callers should only need one of them.

Avoid splits that create shallow methods or force callers to coordinate multiple method calls with intermediate state passing.

### Join Methods to Reduce Complexity

Consider joining methods when it would:
- Replace shallow methods with a deeper one
- Eliminate code duplication
- Remove dependencies or intermediate data structures
- Improve encapsulation by consolidating knowledge
- Simplify caller interfaces

## Red Flags

Watch for these patterns during review:

### Repetition
- The same code (or nearly identical code) appearing multiple times
- Copy-pasted logic with minor variations
- Pattern recurrence that suggests a missing abstraction
- Exception: Don't extract one-liner patterns with complex context dependencies

### Special-General Mixture
- General-purpose classes or methods containing logic specific to particular use cases
- Mechanisms that "know about" their users
- Information leakage where changes to use cases require changes to general infrastructure
- Application-specific code in library-level modules

### Artificial Separation
- Shallow methods that are only called in one place
- Functionality split across classes where both must be understood together
- Intermediate interfaces that just pass data without transformation
- Code separation that forces readers to flip between multiple locations

### Conjoined Methods
- Methods that cannot be understood independently
- Code that is physically separated but intellectually inseparable
- Readers must look at both pieces to understand either one
- Parent-child methods where the child requires knowing parent context

### Inappropriate Grouping
- Unrelated functionality forced together in one class
- Modules that lack a coherent theme or responsibility
- Classes mixing multiple conceptual categories without good reason

### Over-Subdivision
- Many small classes each doing very little
- Explosion of shallow components
- Managing complexity created by numerous interfaces rather than actual domain complexity
- Code that was split based on rigid line-count rules rather than abstraction quality

### Missing Consolidation Opportunities
- Multiple classes with overlapping responsibilities
- Duplicated interfaces that could be unified
- Functionality scattered across modules that share the same knowledge

## Issue Tags

Use these tags when reporting issues:

- **[Repetition]**: Same or similar code repeated without abstraction
- **[Special-General Mixture]**: General-purpose mechanism contains special-purpose code
- **[Conjoined Methods]**: Methods that cannot be understood independently
- **[Artificial Separation]**: Unnecessary splitting that creates shallow components
- **[Over-Subdivision]**: Excessive splitting creating interface proliferation
- **[Missing Consolidation]**: Related functionality scattered across modules
- **[Poor Method Split]**: Method split that doesn't improve abstraction quality
