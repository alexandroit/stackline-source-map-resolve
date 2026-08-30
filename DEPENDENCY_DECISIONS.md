# Dependency Decisions

Observation date: 2026-08-30.

## Production graph

| Former dependency | 1.0.0 version | 1.0.1 decision |
| --- | --- | --- | --- |
| `atob` | `2.1.2` | Remove the edge; use `Buffer.from` or native browser `atob`. |
| `decode-uri-component` | `0.2.2` | Remove the edge; maintain the compatible decoder in-tree under MIT. |

The current `decode-uri-component@0.5.0` release is maintained, but is ESM-only
and requires Node 14.16. Replacing the CommonJS dependency directly would break
the supported Node 12 contract. Keeping `0.2.2` would retain a stale production
edge. Maintaining the compatible decoder in-tree preserves the public contract
without transferring that lifecycle risk to consumers.

The production graph has one node: the root package. Optional and peer
dependency counts remain zero.

## Removed 0.5.x graph

Version 0.6.0 already inlined `resolve-url`, `source-map-url`, and `urix`.
Stackline does not reintroduce them. The `0.5.3` alias is test-only and exists
solely to characterize active downstream pins.

## Browser build graph

`url@0.11.4` and `path-browserify@1.0.1` are exact-pinned development-only
polyfills compiled into the browser artifacts. They are not installed as
production dependencies and are represented by the generated bundle notices.

## Release tooling

Lint, coverage, browser bundling, TypeScript 3.9/current, package analysis,
packed consumers, license checks, audits, signatures, and SBOM generation are
development-only. `package-lock.json` records their exact transitive graph.
