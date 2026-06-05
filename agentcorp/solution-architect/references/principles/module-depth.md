# Module Depth

## Description

Module depth refers to the ratio of functionality to interface complexity. A **deep module** provides substantial functionality behind a simple interface, hiding implementation complexity from users. A **shallow module** has an interface that is complex relative to the functionality it provides, offering little benefit in managing complexity.

The goal is to maximize the benefit (functionality) while minimizing the cost (interface complexity). Deep modules are good abstractions because only a small fraction of their internal complexity is visible to users.

## Core Principles

### Deep vs Shallow Modules

- **Deep modules** have simple interfaces that hide significant implementation complexity. They allow developers to use powerful functionality without understanding internal details (e.g., Unix file I/O with 5 simple system calls managing hundreds of thousands of lines of code).
- **Shallow modules** have interfaces nearly as complex as their implementations. They don't hide much complexity and impose cognitive load without compensating benefits.

### Interface Design

- An interface should be much simpler than the implementation it exposes.
- Interfaces include both formal elements (signatures, types) and informal elements (behavior, usage constraints, documented in comments).
- The interface represents the complexity a module imposes on the rest of the system. Smaller, simpler interfaces introduce less complexity.

### General-Purpose Interfaces

- Somewhat general-purpose interfaces are deeper than special-purpose ones. They should support current needs while being flexible enough for multiple uses.
- General-purpose methods reduce the total number of methods in an API, making it simpler to learn and use.
- Special-purpose interfaces leak information between modules and create tight coupling. User interface abstractions should not appear in lower-level modules.

### Common Case Simplicity

- Interfaces should make the common case as simple as possible. Default behavior should match what most users need.
- Uncommon cases can be supported through optional mechanisms that don't clutter the interface for typical users.

### Avoiding Over-Decomposition (Classitis)

- Breaking up classes into many small pieces creates shallow modules and increases overall system complexity.
- Each small class has its own interface, and these interfaces accumulate to create tremendous system-level complexity.
- Small classes often result in verbose code with excessive boilerplate.

## Red Flags

### Shallow Module Indicators

- **Trivial wrappers**: Methods that simply delegate to another call with minimal transformation (e.g., `addNullValueForAttribute(String attr) { data.put(attr, null); }`)
- **Documentation longer than implementation**: If explaining the interface takes more effort than reading the code, it's likely shallow
- **No abstraction benefit**: The interface exposes all the complexity of the implementation
- **One-use methods**: Methods designed for a single specific use case

### Interface Complexity Indicators

- **Many methods with narrow purposes**: Large number of methods, each serving one specific scenario
- **Special-purpose operations in general modules**: User interface concepts (like "backspace") appearing in a text storage class
- **Boilerplate proliferation**: Requiring multiple objects or calls to accomplish simple tasks (e.g., Java's FileInputStream → BufferedInputStream → ObjectInputStream)

### Over-Decomposition Indicators

See also `cohesion-separation.md` for the full set of together-or-apart red flags and tags.

- **Excessive class count**: Many classes with minimal functionality each
- **Pass-through chains**: Objects created only to be passed to other constructors
- **Verbose setup**: Common operations requiring multi-step initialization

## Issue Tags

Use these tags when reporting module depth issues:

- **[Shallow Module]** - Interface complexity nearly equals implementation complexity
- **[Trivial Wrapper]** - Method provides no meaningful abstraction
- **[Special-Purpose API]** - Interface designed for one narrow use case instead of general-purpose use
- **[Complex Interface]** - Interface has too many methods or parameters for the functionality provided
- **[False Abstraction]** - Interface appears simple but hides important details users need to know
