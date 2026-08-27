# Changelog

## 1.0.0 - unreleased

- Preserve the seven-function `source-map-resolve@0.6.0` CommonJS API.
- Preserve callback/sync readers, partial error metadata, embedded/external
  maps, source contents, source-root options, direct-map mode, and XSSI parsing.
- Add differential coverage for the shared ordinary `0.5.3` surface used by
  active direct consumers.
- Correct Windows drive-letter loss without changing POSIX or network URLs.
- Exact-pin the two audited patched runtime dependencies.
- Add ESM, TypeScript 3.9/current declarations, and tested browser artifacts.
- Add packed-consumer, dependency/license, artifact inventory, checksum, and
  CycloneDX SBOM support.
