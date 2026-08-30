# Release Verification

Observed again on 2026-08-30 in the local workspace, hosted CI, Verdaccio,
official npm, the immutable GitHub release, and the production documentation.

## Passed gates

- `npm run verify` completed successfully after a clean build.
- 514 verbatim upstream 0.6.0 assertions passed.
- 30 adapted Windows assertions and two narrow cross-drive correction tests
  passed.
- 490 comparisons passed across the 0.6.0 primary baseline and shared ordinary
  0.5.3 behavior.
- Contract, callback scheduling, error metadata, malformed input, prototype,
  stress, ESM, global browser, browser ESM, and runtime checks passed.
- TypeScript 3.9 CommonJS declarations and current TypeScript CommonJS/ESM
  declarations compiled without emission.
- Coverage was 96.94% statements/lines, 94.04% branches, and 100% functions.
- Packed CJS, ESM, historical deep entry, examples, inventory, and exact
  production dependency checks passed.
- `publint` and `attw --pack .` found no errors. Publint emitted one non-failing
  modernization suggestion for the legacy string `browser` field; it remains
  intentionally alongside browser export conditions for older bundlers.
- Production and complete npm audits found zero known vulnerabilities.
- All 314 installed registry package signatures verified; 26 packages also had
  verified attestations.
- Installed runtime dependency licenses and shipped attribution files passed.
- Static docs and the exact copied browser ESM artifact executed successfully.
- The dependency-free runtime and Windows-drive checks passed under an actual
  Node.js 12.22.12 binary.

## Immutable 1.0.1 artifact

- file: `release-candidate/stackline-source-map-resolve-1.0.1.tgz`
- size: 77,333 bytes; 20 package files
- SHA-1: `4727eabebade91c29f0565e2a6e59330f4041a7c`
- SHA-256: `fc543f0e987fa6ea6937254f27a545191e6395ab3f9f60e0c50429689af0073e`
- SHA-512: `29066a62db77fdd9d22997c3383ac9bb1bc471c8af2a9c15610e051e17e5de46f504991a9c75bb20264f246d87bd77bfdb13ab1c1ef7499bcfb3ec17fc6b96e8`
- npm integrity: `sha512-KQZqYtt3/dnSKZfDODrJuxvEccivKpwVYQ4FHhfl3kb1BJkanHW7ICZPJG2HvXe/2xOrHB73SZvPs+wX/GuW6A==`

The checksum files, package inventory, release manifest, and CycloneDX
production SBOM are beside the tarball and were parsed or verified locally.
The preparation script refuses to overwrite this directory.

## Registry checkpoint - 2026-08-30

- The exact tarball was published to Verdaccio, fetched back, byte-compared,
  and installed both directly and through the historical-key npm alias.
- The same tarball was published once to official npm. Its public tarball was
  fetched back and byte-compared to the local and Verdaccio copies.
- Official npm reports public access and the `latest` dist-tag as `1.0.1`.
- Immediately after publication, anonymous packument reads returned a
  transient CDN `E404` while the public tarball, authenticated dist-tag, and
  access endpoints were already available. Propagation completed without a
  second publish; metadata and clean scoped/alias consumers then passed.

## Completed external gates - 2026-08-30

- GitHub release-source and final documentation commits passed CI and CodeQL.
  CI exercises Ubuntu and Windows across Node 12, 14, 16, 18, 20, 22, and 24.
- The immutable GitHub release contains nine uploaded assets. Its downloaded
  tarball is byte-identical to the local, Verdaccio, and official npm bytes.
- The production docs, bundled workbench, catalog, search, selector, copy
  action, responsive layouts, robots, canonical/structured metadata, and both
  aggregate sitemaps pass.
- The exact alias migration in `microsoft/vscode-react-native` passed install,
  build, focused resolver, full test, and localization gates before PR #2900.
  Its existing ambient declaration remains intentionally.
- A different qualified repository received issue #1446 for the maintainer
  decision requested by its contribution policy.

`Raku/nqp` remains ineligible while it supports Node 10.10. Published status
does not relax downstream compatibility or contact gates.
