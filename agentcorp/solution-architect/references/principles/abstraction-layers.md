# Abstraction Layers

## Description

This dimension evaluates how well a system separates concerns across architectural layers. In well-designed systems, each layer provides a distinct abstraction from adjacent layers — following an operation through method calls should reveal changing abstractions at each level. When adjacent layers expose similar abstractions, it signals confused responsibility boundaries and shallow design that adds interface complexity without proportional functionality gains.

Key concerns include:
- **Layer separation**: Whether each layer provides a meaningfully different abstraction
- **Pass-through methods/variables**: Methods or variables that traverse layers without transformation
- **Complexity placement**: Whether complexity is pushed to callers or pulled into modules

## Core Principles

### Different Layer, Different Abstraction

Each layer in a system should provide a distinct abstraction from the layers above and below it. When adjacent layers have similar abstractions, they likely haven't earned their place in the design — they add structural overhead without sufficient functional benefit.

**Example**: A file system's layers provide genuinely different abstractions: variable-length byte arrays (files) → fixed-size cached blocks → device driver block I/O. Each level transforms how users think about the data.

### Pull Complexity Downward, Not Upward

When unavoidable complexity arises, modules should absorb it internally rather than exposing it to users. Since modules typically have many users but few developers, it's better for developers to handle complexity once than force every user to deal with it. Prioritize simple interfaces over simple implementations.

**Anti-pattern**: Exposing configuration parameters or throwing exceptions for cases that could be handled internally, forcing every caller or administrator to solve the same problem.

### Eliminate Pass-Through Methods

Pass-through methods (methods that simply delegate to another method with a similar signature) indicate confused responsibility boundaries. They make classes shallower by adding interface complexity without adding functionality, and they create unnecessary dependencies between layers.

**Solution approaches**:
- Expose the lower-level class directly to callers
- Redistribute functionality to eliminate cross-class calls
- Merge the classes if they can't be clearly separated

### Avoid Pass-Through Variables

Variables that are passed through long chains of methods force all intermediate layers to be aware of concerns they don't use. This spreads knowledge across layers and makes evolution difficult.

**Solution approaches**:
- Use a context object to store system-wide state and store references to it in major objects
- Find existing shared objects that can carry the information
- Avoid global variables (they prevent multiple system instances and create testing problems)

### Match Internal and External Abstractions

A class's interface should provide a different abstraction than its internal implementation. When interface and implementation use the same representation, the class is likely shallow.

**Example**: A text class that stores text as lines internally should still expose a character-oriented interface (insert/delete at arbitrary positions) rather than a line-oriented interface (get/put whole lines). The abstraction gap represents valuable functionality.

## Red Flags

Watch for these patterns during review:

### Pass-Through Methods
- Methods that do nothing but call another method with the same or very similar signature
- Chains of delegation without transformation or added logic
- Classes where most public methods are simple forwarders
- Exception: Dispatchers that select which method to invoke based on arguments are legitimate

### Pass-Through Variables
- Variables passed through multiple method signatures but only used at the deepest level
- Long parameter lists where most parameters are just forwarded
- Global state that must be threaded through call chains

### Similar Abstractions Across Layers
- Interface signatures that closely mirror the implementation approach
- External APIs that expose internal representation details
- Wrappers or decorators that add minimal functionality relative to interface size

### Complexity Pushed Upward
- Configuration parameters for decisions the module could make internally
- Exceptions thrown for conditions the module could handle
- APIs requiring callers to perform multi-step coordination (split/join, setup/teardown)
- Simple operations requiring users to understand internal structure

### Decorator Overuse
- Separate decorator classes for small features that could merge into the base class
- Multiple shallow decorators each adding minimal functionality
- Decorators used for general-purpose features that everyone needs

### Interface Duplication Without Value
- Multiple methods with similar signatures that don't provide distinct functionality
- Layers that replicate APIs from layers below without transformation
- Boilerplate code that connects layers without adding abstraction

## Issue Tags

Use these tags when reporting issues:

- **[Pass-Through Method]**: Method delegates to another without adding functionality
- **[Pass-Through Variable]**: Variable threaded through methods that don't use it
- **[Similar Layer Abstractions]**: Adjacent layers expose similar abstractions
- **[Complexity Pushed Up]**: Module forces callers to handle complexity
- **[Shallow Decorator]**: Decorator adds minimal functionality for its interface size
- **[Interface Matches Implementation]**: External API mirrors internal representation
