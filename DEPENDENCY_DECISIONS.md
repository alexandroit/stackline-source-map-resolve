# Dependency Decisions

Observation date: 2026-08-27.

## Production graph

| Dependency | Upstream range | Stackline version | Decision |
| --- | --- | --- | --- |
| `atob` | `^2.1.2` | `2.1.2` | Exact-pin the patched compatible release. |
| `decode-uri-component` | `^0.2.0` | `0.2.2` | Exact-pin above the historical `<0.2.1` advisory range. |

A clean upstream install currently resolves these same patched versions and
has zero production audit findings. Exact pins are a reproducibility and
regression boundary, not a claim that the current upstream install is
vulnerable.

The production graph has three nodes including the root package, with zero
optional and peer dependencies.

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
