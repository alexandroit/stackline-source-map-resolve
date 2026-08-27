# Local Verification

Observed at 2026-08-27T17:52:02-04:00 in the local package workspace. No npm
publication, GitHub creation or push, registry write, messaging, or deployment
was performed.

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
- Coverage was 99.41% statements/lines, 95.32% branches, and 100% functions.
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

## Immutable local candidate

- file: `release-candidate/stackline-source-map-resolve-1.0.0.tgz`
- size: 76,129 bytes; 20 package files
- SHA-1: `a886d7156121d4b57dcb69b35b6033ef1385585c`
- SHA-256: `77a62ce17a2a490d1c7525185216151ef60279634b37716f278a6f376aa17769`
- SHA-512: `0c6686f9086ee76064c93913a9744675c03f14513d9c0af401d97c70d75aa770aa9a60ec96fdba56325e8ffccd8499100312b39502a3526f13581d3a8d75d31f`
- npm integrity: `sha512-DGaG+Qhu52BkyTkTqXRGdcA/FFE9nAr0Adl8cNdap3CqmmDslv26VjJej/zNhJkQAxKzlQKjUm8TWB06jXXTHw==`

The checksum files, package inventory, release manifest, and CycloneDX
production SBOM are beside the tarball and were parsed or verified locally.
The preparation script refuses to overwrite this directory.

## Remaining external gates

- Execute the checked-in Ubuntu/Windows Node 12, 14, 16, 18, 20, 22, and 24 CI
  matrix in a future authorized GitHub repository.
- Install this exact digest in each adoption target and run that consumer's own
  build and tests. Existing ambient type declarations are not assumed removable.
- `Raku/nqp` remains blocked while it supports Node 10.10; this package requires
  Node 12 or newer.
- Separately authorized work must create repositories, stage/publish the exact
  bytes, run `test:registry`, deploy docs, and contact consumers.
