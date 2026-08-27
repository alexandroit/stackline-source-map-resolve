# Registry Handoff

- upstream: `source-map-resolve@0.6.0`
- shared active-consumer baseline: `source-map-resolve@0.5.3`
- Stackline target: `@stackline/source-map-resolve@1.0.0`
- decision: GO, frozen in `UPSTREAM_AUDIT.md`
- runtime: Node `>=12`
- API: seven-function CommonJS root; sync/callback readers and error metadata
- additive: ESM, TypeScript declarations, browser artifacts, export map
- intentional correction: Windows drive-letter retention
- runtime dependencies: exact `atob@2.1.2` and
  `decode-uri-component@0.2.2`; zero optional and peer dependencies
- local verification: PASSED (`npm run verify`, Node 12.22.12 runtime checks,
  checksum validation); details in `VERIFICATION.md`
- immutable candidate:
  `release-candidate/stackline-source-map-resolve-1.0.0.tgz`
- candidate SHA-256:
  `77a62ce17a2a490d1c7525185216151ef60279634b37716f278a6f376aa17769`
- publication status: exact immutable bytes published to Verdaccio and
  official npm on 2026-08-27; official anonymous metadata propagation was
  pending at the immediate post-publish checkpoint

Do not recommend migration to a consumer whose declared runtime includes Node
10 without an explicit runtime-floor decision. Do not claim byte-for-byte
0.5.x compatibility or a vulnerability in a current clean upstream install.
Do not promise that consumer-owned ambient TypeScript shims can be removed
without compiling that consumer against this exact candidate.

Post-publication work must use the existing artifact bytes, finish the hosted
platform matrix and public release surfaces, install the exact release into
adoption targets, and never rebuild or republish version `1.0.0`.
