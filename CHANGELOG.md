# Changelog

## [1.0.2] - 2026-09-28

- Organize package documentation, preserve API and migration examples, and add Stackline community links.
- Update the development-only qs parser to 6.16.0; preserve the existing runtime dependency contract.
- Improve package discovery keywords with precise domain terms and `stackline`.
- Pin GitHub Actions release tooling and require an explicit missing-version response before publication.


## 1.0.1 - 2026-08-30

- Remove both production dependency edges while preserving Node 12, CommonJS,
  ESM, browser, URL-decoding, and UTF-8 base64 behavior.
- Replace the abandoned `atob@2.1.2` package with the runtime's native base64
  primitive and maintain the tolerant URI decoder in-tree under its MIT terms.
- Require warning-free packed installs, a valid dependency tree, and zero
  production audit findings.

## 1.0.0 - 2026-08-27

- Preserve the seven-function `source-map-resolve@0.6.0` CommonJS API.
- Preserve callback/sync readers, partial error metadata, embedded/external
  maps, source contents, source-root options, direct-map mode, and XSSI parsing.
- Add differential coverage for the shared ordinary `0.5.3` surface used by
  active direct consumers.
- Correct Windows drive-letter loss without changing POSIX or network URLs.
- Exact-pin the two then-audited patched runtime dependencies.
- Add ESM, TypeScript 3.9/current declarations, and tested browser artifacts.
- Add packed-consumer, dependency/license, artifact inventory, checksum, and
  CycloneDX SBOM support.
