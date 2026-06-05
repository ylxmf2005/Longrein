# Information Hiding

## Description

Information hiding is the technique of encapsulating design decisions within a module so they don't appear in its interface and are invisible to other modules. Each module should hide knowledge about implementation mechanisms, including data structures, algorithms, and design assumptions. The opposite is **information leakage**, where the same design decision is reflected in multiple modules, creating dependencies that require coordinated changes.

Good information hiding simplifies interfaces and makes systems easier to evolve. When information is hidden, changes to that information affect only the module containing it.

## Core Principles

### Encapsulation of Design Decisions

- Each module should encapsulate specific pieces of knowledge representing design decisions (e.g., how to parse JSON, how to store data in a B-tree, how to implement TCP).
- Hidden information includes data structures, algorithms, low-level details (like page sizes), and high-level assumptions (like "most files are small").
- The goal is to make information totally hidden so it's irrelevant and invisible to module users. Partial hiding (information needed only by a few users, accessed through separate methods) also has value.

### Private vs Information Hiding

- Declaring variables and methods private is not the same as information hiding. Private elements help but don't guarantee it.
- Public getters and setters can expose information about private variables just as much as if the variables were public.
- True information hiding means the nature and usage of internal data are not exposed through the interface at all.

### Information Leakage

- Information leakage occurs when a design decision is reflected in multiple modules. Any change to that decision requires changes to all involved modules.
- Leakage can be explicit (through interfaces) or back-door (both modules know about a file format, even if it's not in their interfaces). Back-door leakage is more pernicious because it's not obvious.
- If you encounter leakage between classes, reorganize so that knowledge affects only a single class. Options include merging classes or extracting shared knowledge into a new class with a simple, abstract interface.

### Avoiding Temporal Decomposition

- **Temporal decomposition** structures the system according to the time order in which operations occur (e.g., separate classes for reading, modifying, and writing a file).
- This causes information leakage because design decisions (like file format) manifest at multiple points in execution.
- Focus on the knowledge needed to perform each task, not the order of operations. Combine related knowledge into single modules even if that knowledge is used at different times.

### Interface Design for Hiding

- Simpler interfaces correlate with better information hiding. Complex interfaces expose more information and create more dependencies.
- Don't expose internal data structures (e.g., returning the internal Map used to store parameters). Changes to internal representation shouldn't affect the interface.
- Provide deeper methods that hide internal representations and reduce caller burden (e.g., `getParameter(String name)` instead of `getParams()` returning the internal Map).

### Defaults and "Do the Right Thing"

- Provide sensible defaults for common cases. Defaults are a form of partial information hiding — callers don't need to know about them in normal use.
- Classes should "do the right thing" automatically without being explicitly asked. For example, buffering in file I/O should be automatic, not opt-in.
- Make the common case as simple as possible. Rare cases can require special methods.

### Making Classes Larger for Better Hiding

- Information hiding can often be improved by making a class slightly larger to bring together all code related to a particular capability.
- Combining related functionality can raise the level of the interface (e.g., one method for the entire computation instead of three methods for three steps).
- This results in deeper modules with simpler interfaces.

## Red Flags

### Information Leakage Indicators

- **Duplicated knowledge**: Multiple classes understand the same file format, protocol, or data structure
- **Back-door dependencies**: Classes depend on the same design decision even though it's not in their interfaces
- **Coordinated changes**: Changing one design decision requires modifications to multiple modules

### Temporal Decomposition Indicators

- **Operation order in structure**: Different phases of execution (read, process, write) are in separate classes
- **Shared format knowledge**: Both reader and writer classes need to understand the same format
- **Phase-based naming**: Class names like `RequestReader` and `RequestParser` that reflect sequential steps

### Shallow Interface Indicators

- **Exposed internals**: Methods return internal data structures (Maps, Lists) used to store state
- **Getters for internal structures**: `getParams()` returning the internal parameter map instead of `getParameter(name)`
- **Representation leakage**: Interface changes when internal representation changes
- **Extra caller work**: Callers must perform additional lookups or conversions after retrieving data

### Missing Defaults

- **Forced specification**: Callers must provide values that could be determined automatically (e.g., HTTP response version matching request version)
- **Uncommon options as required**: Rare configuration options must be specified even in common cases
- **Overexposure**: Using common features forces users to learn about rarely-used features

### Over-Decomposition

See also `cohesion-separation.md` for the full set of together-or-apart red flags and tags.

- **One stage per class**: Each step of a multi-step process (like reading and parsing) is in a separate class
- **Duplicate parsing**: Similar parsing or validation logic appears in multiple places
- **Complex usage patterns**: Callers must invoke multiple methods in a specific order to accomplish one task

## Issue Tags

Use these tags when reporting information hiding issues:

- **[Information Leakage]** - Same knowledge or design decision appears in multiple modules
- **[Temporal Decomposition]** - System structure reflects execution order instead of knowledge boundaries
- **[Exposed Internals]** - Internal data structures or representations visible in the interface
- **[Shallow API]** - Interface exposes too much detail or provides insufficient abstraction
- **[Missing Defaults]** - Common cases require explicit specification of values that could be automatic
