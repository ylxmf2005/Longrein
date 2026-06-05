# Local Engineering Principles

Use these principles during plan review and when judging implementation constraints.

## Deep Modules

Prefer interfaces that are simple for callers while hiding meaningful implementation complexity. Shallow wrappers that expose every internal concern increase cognitive load.

## Information Hiding

Keep volatile details behind stable interfaces. A plan that requires callers to know storage layout, timing, parsing internals, or environment quirks is leaking design.

## Clear Layers

Each layer should provide a distinct abstraction. Pass-through layers, mixed UI/API/persistence logic, and filesystem concerns inside protocol code are signs that boundaries are blurred.

## Cohesion And Separation

Things that change together should live together. Things with different reasons to change should be separated. Avoid splitting one concept across many files only to appear modular.

## Error Handling

Prefer making invalid states impossible or explicit. Avoid catch-and-continue behavior that turns failures into misleading success.

## Naming And Documentation

Names should reveal domain meaning, units, and intent. Comments should explain non-obvious design decisions, not restate code.

## Strategic Design

Small choices accumulate. Prefer the simplest design that localizes change, reduces cognitive load, and makes future modifications discoverable.
