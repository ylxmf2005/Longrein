---
id: extract-contracts
name: Extract Contracts
inputs: [architecture doc]
outputs: [Markdown contract design artifact]
optional: true
---

# Phase: Extract Contracts

## Purpose
Extract interface contracts from the architecture or impact document so parallel implementation sessions can build against stable boundaries.

## Process

1. **Read the architecture or impact document**
2. **For each submodule**, identify what it exposes to other submodules
3. **Document interface contracts** — signatures, schemas, protocol shapes, and ownership only; no implementation bodies
4. **For types/schemas shared by 2+ submodules**, define them once in a shared contracts section

Write the extracted contracts to the assignment's `output_path`, normally `design/extracted-contracts.md`.

**Example contract snippet:**
```typescript
export interface ReportGenerator {
  generate(data: ReportData, options: RenderOptions): Promise<ReportResult>;
}

export interface ReportResult {
  filePath: string;
  pageCount: number;
  errors: string[];
}
```

Use code fences only to describe the contract. Do not create source files unless Delivery Orchestrator explicitly assigns implementation work.

## Principles

- `principles/module-depth.md` — Interfaces should be simple, implementations complex
- `principles/information-hiding.md` — Contracts define what is exposed; everything else is hidden
- `principles/abstraction-layers.md` — Each contract should provide a distinct abstraction

## Outputs
- Markdown extracted contracts artifact at the assigned `output_path`.
- One section per submodule/interface.
- One shared contracts section for shared types or schemas.

## Quality Gate
- Every submodule in the architecture doc has a corresponding contract
- Contracts contain only signatures and types, no implementations
- Shared types are in a single shared contract file

## Skip Conditions
- S complexity tasks with a single submodule
- Tasks where parallel implementation is not needed
