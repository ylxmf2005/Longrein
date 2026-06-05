# Strategic Design

## Description

Strategic design is about programming with a long-term investment mindset rather than short-term expediency. This dimension evaluates whether code changes demonstrate thoughtful design investment, whether modifications improve or degrade system structure, whether developers resist tactical shortcuts, and whether the codebase shows signs of continuous small improvements versus accumulated quick fixes. It also covers appropriate use of design patterns and development practices, rejecting both under-engineering and over-engineering.

## Core Principles

### Working Code Is Not Enough

The primary goal should be producing excellent system design that also happens to work, not merely getting features working quickly. Most code is written by extending existing systems, so the most important job is facilitating future extensions. Code that "just works" but introduces unnecessary complexity creates debt that compounds over time.

Tactical programming focuses on completing the current task as fast as possible, accepting small compromises in design quality for short-term speed. Each tactical shortcut adds incremental complexity. While the first few shortcuts seem harmless, they accumulate rapidly, and before long the codebase becomes a mess requiring extensive cleanup that never gets scheduled.

Strategic programming adopts an investment mindset: take extra time up front to improve system design. These investments slow initial progress slightly but accelerate development in the long term. The recommended investment is 10-20% of development time - small enough to avoid significantly impacting schedules, large enough to produce meaningful benefits. The payoff typically appears within months.

### Modifications Should Improve Design

When modifying existing code, resist the temptation to make minimal changes that "just work." Instead, ask whether the current system design remains optimal given the desired change. If not, refactor toward the design the system would have had if built from scratch with this change in mind.

The most common tactical pattern during modifications is asking "what is the smallest possible change that does what I need?" This introduces special cases, dependencies, and workarounds that degrade the design incrementally. Developers often justify minimal changes by citing unfamiliarity with the code or fear of introducing bugs, but this merely delays the inevitable complexity accumulation.

Ideally, after each change the system structure should be better than before. If you're not actively improving the design, you're probably making it worse. Even when your specific change doesn't require refactoring, look for design imperfections to fix while you're in the code.

### Continuous Small Investments

Investment should be continuous and immediate, not deferred. When design problems surface, fix them promptly rather than patching around them. During crunches, it's tempting to delay cleanup until after the deadline, but this is a slippery slope - there's always another crunch. The longer you wait to address design problems, the more intimidating they become, making further delay more likely.

Proactive investments include:
- Exploring alternative designs before implementation
- Choosing simpler abstractions over the first idea
- Anticipating likely future changes and ensuring they'll be easy
- Writing thorough documentation

Reactive investments include:
- Fixing discovered design mistakes rather than ignoring or patching them
- Refactoring when modifying code to maintain clean structure
- Continuously making small improvements to existing code

### Incremental Development of Abstractions, Not Features

Incremental and iterative development is valuable, but the units of development should be abstractions, not features. It's impossible to visualize complete system design upfront; good design emerges through experience with the system. Develop in increments, where each increment adds a few new abstractions and refactors existing ones based on experience.

However, don't implement abstractions piecemeal. Once you discover the need for an abstraction, design it comprehensively rather than building it gradually feature-by-feature. Tackle the abstraction all at once (or at least enough to provide a reasonably complete set of core functions) to produce a clean design whose pieces fit together well.

Agile development's focus on rapid feature delivery can lead to tactical programming if misapplied. Deferring design decisions to ship features faster encourages tactical shortcuts and complexity accumulation. When an abstraction becomes necessary, invest time to design it cleanly and make it somewhat general-purpose.

### Design Exploration (Process Principle)

The "design it twice" philosophy suggests considering multiple alternatives for major design decisions rather than implementing the first idea. This is a process principle that cannot be evaluated from finished code, but evidence of inadequate design exploration sometimes surfaces as awkward interfaces that seem to miss obvious alternatives.

Considering radically different approaches - even apparently inferior ones - helps identify strengths and weaknesses. The best choice may be one alternative, a combination of features from multiple alternatives, or a new design inspired by problems identified in the originals.

### Appropriate Use of Patterns and Practices

Development paradigms and patterns should be evaluated critically based on whether they reduce or increase complexity:

**Design patterns** provide proven solutions to common problems. Use them when they fit naturally, but don't force problems into patterns when custom approaches would be cleaner. Using patterns doesn't automatically improve design; it only helps when the patterns genuinely fit the problem.

**Test-driven development** focuses attention on getting features working rather than finding the best design. This is tactical programming. Writing tests first for bug fixes makes sense (to verify the bug is truly fixed), but for new development, design the abstraction first, then write tests.

**Unit tests** are valuable because they facilitate refactoring. With good test coverage, developers can confidently make structural improvements, leading to better design. Without tests, developers avoid refactoring and minimize code changes, allowing complexity to accumulate and mistakes to persist.

### Avoid Premature Performance Optimization

Optimizing every statement for maximum speed slows development and creates unnecessary complexity. Many "optimizations" won't actually help performance. However, completely ignoring performance leads to death by a thousand cuts - numerous small inefficiencies spread throughout code, making the system 5-10x slower than necessary with no single improvement providing much impact.

The balanced approach: develop awareness of fundamentally expensive operations (network communication, disk I/O, memory allocation, cache misses) and use this knowledge to choose design alternatives that are naturally efficient yet clean and simple. Avoid premature micro-optimization, but don't introduce obviously inefficient designs when equally clean efficient alternatives exist.

## Red Flags

### Evidence of Tactical Programming

- Minimal changes that patch around problems rather than fixing root causes
- Quick hacks and workarounds instead of proper solutions
- Special cases added for specific features rather than generalizing the abstraction
- Code comments acknowledging shortcuts or technical debt without fixing them
- Accumulated complexity from many small compromises

### Degrading Modifications

- Changes that make the design more complex without proportional functionality gains
- New code that doesn't follow existing patterns and abstractions, creating inconsistency
- Modifications that increase coupling or dependencies between modules
- Refactoring incomplete - partway between old and new design, leaving mess
- Adding code that would have been designed differently if building from scratch

### Missing Investment

- No evidence of design exploration; first implementation idea appears to have been coded directly
- Abstractions that are obviously too specific to current needs, requiring modification for reasonable variations
- Repeated similar code that should have been unified during implementation
- Design problems that were identified but never fixed, just worked around
- No proactive simplification of interfaces or reduction of complexity

### Misapplied Practices

- Forced design patterns that don't fit naturally, adding unnecessary complexity
- Over-engineering with abstractions or configurability for hypothetical future needs
- Premature performance optimization creating complexity without measured benefit
- Test-driven development leading to incremental feature hacking rather than cohesive abstraction design
- Excessive getters and setters exposing implementation details instead of hiding information

### Feature-Driven Development

- Abstractions cobbled together piece-by-piece as features demanded them, lacking cohesion
- Interfaces that require multiple method calls for common operations because they were designed one feature at a time
- General-purpose mechanisms delayed indefinitely while special-purpose workarounds multiply
- No time allocated for design; features added as quickly as possible without architectural consideration

### Deferred Design Problems

- TODO comments or issue tracker items for design improvements that never get addressed
- Known complexity hotspots that everyone works around but nobody fixes
- Accumulation of "temporary" solutions that became permanent
- Comments indicating desire to refactor but never doing it
- Technical debt acknowledged but never paid down

## Issue Tags

- **[Tactical Programming]**: Evidence of short-term shortcuts and minimal changes rather than thoughtful design
- **[Design Degradation]**: Modifications that make the design worse instead of better
- **[Missing Investment]**: Lack of design exploration or proactive simplification
- **[Forced Pattern]**: Design pattern applied where it doesn't fit naturally
- **[Premature Optimization]**: Complexity introduced for performance without evidence it's needed
- **[Feature-Driven Design]**: Abstractions built piecemeal driven by features rather than designed cohesively
- **[Deferred Cleanup]**: Acknowledged design problems never fixed, just worked around
- **[Over-Engineering]**: Unnecessary abstractions or configurability for hypothetical future requirements
