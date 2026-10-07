# Graph Classes

An interactive guide to graph classes and how they relate. Each class has a formal definition,
equivalent characterizations, links to Wikipedia and [ISGCI](https://www.graphclasses.org), and
step-by-step animated examples. The hierarchy page shows the inclusion diagram, and selected
inclusions come with animated proofs.

## Pages

| Route                     | Content                                         |
| ------------------------- | ----------------------------------------------- |
| `/`                       | All graph classes                               |
| `/hierarchy`              | Inclusion diagram (subclass → superclass)       |
| `/classes/[id]`           | Definition, description and examples of a class |
| `/inclusions/[from]/[to]` | Animated proof that `from` ⊂ `to`               |

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test:all   # typecheck, unit, component and e2e tests
pnpm lint
pnpm format
```

See [TESTING.md](TESTING.md) for the test layers.

## Adding a graph class

1. Create `src/data/graph-classes/<id>.ts` exporting a `GraphClass` (see `src/types/graph.ts`).
2. Register it in `src/data/graph-classes/index.ts`.
3. Set `superclasses` to the **immediate** superclasses only. The hierarchy tests reject cycles
   and edges already implied by others.
4. If the class is a common source of mistakes, add known inclusions and non-inclusions (with
   counterexamples) to `src/data/graph-classes/hierarchy.test.ts`.

Definitions and example steps support `$...$` for inline LaTeX. Use `{term}` to link a term from
the glossary in `src/data/glossary.ts`. This works in descriptions, characterizations, forbidden
subgraphs and steps, but not in the formal definition.

## Adding an inclusion proof

Create a file in `src/data/inclusions/` exporting an `InclusionProof` and register it in
`src/data/inclusions/index.ts`. The `from → to` pair must be an edge in the hierarchy.
