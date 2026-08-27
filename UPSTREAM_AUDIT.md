# Upstream Audit and Intake Decision

Observation date: 2026-08-27 (primary-source checks completed between
21:22Z and 21:29Z).

## Identity

- npm package: `source-map-resolve@0.6.0`
- canonical repository: https://github.com/lydell/source-map-resolve
- release commit: `eeed61bac2e498ea5239c8162101b021f568b959`
- publication: 2020-03-21
- npm artifact SHA-1: `3d9df87e236b53f16d01e58150fc7711138e5ed2`
- npm integrity:
  `sha512-KXBr9d/fO/bWo97NXsPIAW1bFSBOuCnjbNTBMO7N59hsv5i9yzRDfcYwwt0l04+VqnKC+EwzvJZIP/qkuMgR/w==`
- artifact inventory: 5 files, 7,637 packed bytes, 23,823 unpacked bytes
- npm identity: author Simon Lydell; sole npm maintainer `lydell`
- license: MIT, Copyright (c) 2013–2014 Simon Lydell

The repository is public and archived. The npm package is explicitly
deprecated and the last release is more than six years old. The published
tarball, registry metadata, tag, repository history, issues, pull requests,
and GitHub advisory records were checked directly. The proposed scoped name
`@stackline/source-map-resolve`, npm release `1.0.0`, and public repository
`alexandroit/stackline-source-map-resolve` did not exist when checked.

Primary records:

- https://registry.npmjs.org/source-map-resolve/0.6.0
- https://registry.npmjs.org/-/npm/v1/security/advisories/bulk
- https://github.com/lydell/source-map-resolve/tree/v0.6.0
- https://github.com/lydell/source-map-resolve/issues
- https://github.com/lydell/source-map-resolve/pulls
- https://github.com/advisories/GHSA-w573-4hg7-7wgq
- https://github.com/advisories/GHSA-8w4h-3cm3-2pm2

## Published compatibility surface

The root is a CommonJS object with seven enumerable functions:
`resolveSourceMap`, `resolveSourceMapSync`, `resolveSources`,
`resolveSourcesSync`, `resolve`, `resolveSync`, and `parseMapToJSON`.
It resolves external and JSON data-URI maps; reads embedded or external source
contents; handles `sourceRoot` overrides; supports callback and synchronous
readers; annotates failures with `sourceMapData`; accepts a map URL directly
when `resolve`/`resolveSync` receives `code === null`; strips the source-map
XSSI prefix; and is documented for both Node and browser readers.

The async API has observable scheduling and error behavior. Results that need
no I/O are delivered asynchronously. Individual source-read failures are
stored in `sourcesContent`, while map-read and parse failures are returned to
the callback with partial `sourceMapData`. The synchronous APIs are in active
downstream use and cannot be removed.

All three licensed upstream suites pass unchanged on the current production
runtime: 500, 14, and 30 assertions (544 total).

## Maintenance and security assessment

The deprecation record identifies real design limits: language-agnostic
source-map-comment matching is ambiguous, the source-map specification is
underspecified, and URLs cannot always be treated as filesystem paths. Open
issue #9 documents a Windows cross-drive resolution defect. The unreleased
`next` branch modernizes the implementation but removes all synchronous APIs
and changes callback readers to promises, so it is not a compatible successor.

The published dependency ranges are `atob ^2.1.2` and
`decode-uri-component ^0.2.0`. Clean installation currently resolves
`atob@2.1.2` and `decode-uri-component@0.2.2`, and an official npm production
audit reports zero vulnerabilities. Historical advisories affect
`atob <2.1.0` and `decode-uri-component <0.2.1`; the repository's old lockfile
contains a vulnerable historical version but is not shipped to consumers.
No advisory is assigned directly to `source-map-resolve`. This project must
therefore not claim that a current clean install is vulnerable.

The maintenance delta is bounded: preserve the small implementation and its
two patched runtime dependencies, document the ambiguous-comment limitation,
add first-party declarations and a real ESM facade, provide a tested browser
artifact, cover malformed data and Unicode decoding, characterize async
ordering and partial-error metadata, and correct Windows cross-drive URL
resolution without changing ordinary URL behavior.

## Current use and successor landscape

Official npm recorded 13,519,074 downloads for 2026-08-20 through 2026-08-26,
observed from:
https://api.npmjs.org/downloads/point/2026-08-20:2026-08-26/source-map-resolve.
Downloads alone were not treated as proof of direct use.

Current source inspection proves direct use in active repositories, including:

- `Raku/nqp`, pushed 2026-08-26, directly declares `source-map-resolve ^0.5.1`
  in `src/vm/js/nqp-runtime/package.json` and calls
  `resolveSourceMapSync` from `resolve-sourcemap.js`;
- `microsoft/vscode-react-native`, pushed 2026-08-27, imports the package from
  `src/debugger/sourceMapsCombinator.ts` and resolves source maps in its
  debugger pipeline.

These are source and manifest observations, not inferences from lockfiles or a
dependency graph.

No published maintained drop-in replacement was found.
`@jridgewell/resolve-uri@3.1.2` is a useful maintained URL primitive but does
not find map comments, read maps or sources, preserve callback/synchronous
reader APIs, or attach partial error metadata. `source-map-loader@5` is a
Webpack loader rather than a library-compatible replacement. A GitHub fork
named `source-map-resolve-secure` has no npm release. Upstream's `next` branch
is explicitly incompatible with the published API.

## Decision

**GO.** Build `@stackline/source-map-resolve@1.0.0` as a transparent,
compatibility-first maintained fork.

The decision is based on verified active direct runtime use, an archived and
deprecated upstream, a stable but non-trivial API that includes irreplaceable
synchronous consumers, a documented correctness gap, a small supportable
implementation, and the absence of a drop-in successor. Qualification does
not rely on download volume, roadmap membership, a lockfile, or an npm
dependency graph.

The initial release is constrained to compatibility, documentation, types,
packaging, browser validation, patched dependency resolution, and narrowly
verified correctness changes. It will retain attribution and the MIT license,
state that Stackline is not affiliated with or endorsed by Simon Lydell, and
will not imply that current upstream installations are vulnerable.
