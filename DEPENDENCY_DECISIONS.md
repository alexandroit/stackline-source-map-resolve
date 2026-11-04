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

## 2026-09-28 development fixture advisory

The two exact upstream comparison fixtures, `source-map-resolve@0.5.3` and
`source-map-resolve@0.6.0`, retain their historical CommonJS decoder dependency.
That development-only dependency is affected by
[GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr).
The patched decoder 0.5.0 is ESM and cannot be substituted into these frozen
CommonJS fixtures without changing the comparison baseline. Tests use bounded,
repository-controlled fixture data; these packages are not included in the
published runtime closure.

The maintained runtime already decodes malformed percent sequences in one
non-recursive pass and has malformed-input and stress regression coverage.
`audit:all` first requires a clean production audit, then permits only this
exact advisory on the three development fixture paths. Any new advisory,
non-development path, or registry/audit error fails the gate. The remaining
fixture advisory is reported explicitly rather than described as a clean full
audit. The development `qs` dependency is pinned to the patched 6.16.0 release.

## 2026-09-29 direct dependency maintenance

The exact aliases `path-browserify: npm:@stackline/path-browserify@1.0.0`,
`url: npm:@stackline/url@1.0.0`, and
`setimmediate: npm:@stackline/setimmediate@1.0.0` preserve the existing import
names. The first two contribute code to browser bundles; the build records
actual contributing input files and the immutable release includes their
resolved names, versions, integrity and licenses in `bundled-sbom.cdx.json`.
Setimmediate is used only by tests. The installed production graph remains
empty. The historical upstream oracles and the narrow advisory gate above
remain unchanged; the full source audit is not described as zero findings.

## 2026-11-04 fixture-only advisory review

The immutable 0.5.3/0.6.0 comparison fixtures also inherit high-severity
[GHSA-qr28-fpjm-wq7f](https://github.com/advisories/GHSA-qr28-fpjm-wq7f),
fixed upstream in decoder 0.5.1. Replacing their historical CommonJS decoder
would change the independent comparison oracle; the earlier 0.5.0 release
only fixed GHSA-vcc3-ghjq-m6fr. Both advisories remain real in decoder 0.2.2.
The raw development audit reports two high-severity package findings (the
decoder and its source-map-resolve parent), not a clean full audit.

Only test/differential.js and test/windows-cross-drive.test.js load the
baselines, using bounded, repository-controlled inputs. The maintained
index.js decoder advances one position per pass, emits chunks, and joins once;
it has neither the recursive split nor a full-string replacement per distinct
encoded run. Existing malformed-input/stress tests exercise only that runtime.
Production installs have no dependency edges. Measured browser inputs and
packed inventories exclude the fixtures and decoder package.

The exception expires 2026-12-04 and requires exact baseline and decoder
versions, decoder integrity, development-only paths, only the two reviewed
advisories, no additional decoder consumers, no production dependencies, and
no fixture browser material. Unknown advisories, paths, versions, graph
changes, or registry failures reject the gate. Negative policy tests run as
part of audit:all. The raw counts and accepted advisories remain visible.

Browser build aliases now use published @stackline/path-browserify and
@stackline/url 1.0.2; test-only @stackline/setimmediate also uses 1.0.2.
