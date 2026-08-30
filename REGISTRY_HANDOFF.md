# Registry Handoff

- upstream: `source-map-resolve@0.6.0`
- shared active-consumer baseline: `source-map-resolve@0.5.3`
- Stackline current release: `@stackline/source-map-resolve@1.0.0`
- Stackline remediation target: `@stackline/source-map-resolve@1.0.1`
- decision: GO, frozen in `UPSTREAM_AUDIT.md`
- runtime: Node `>=12`
- API: seven-function CommonJS root; sync/callback readers and error metadata
- additive: ESM, TypeScript declarations, browser artifacts, export map
- intentional correction: Windows drive-letter retention
- 1.0.1 production graph: zero runtime, optional, and peer dependencies;
  compatible base64 and tolerant URI decoding are maintained in-tree
- local verification: PASSED (`npm run verify`, Node 12.22.12 runtime checks,
  checksum validation); details in `VERIFICATION.md`
- immutable candidate:
  `release-candidate/stackline-source-map-resolve-1.0.0.tgz`
- candidate SHA-256:
  `77a62ce17a2a490d1c7525185216151ef60279634b37716f278a6f376aa17769`
- publication status: PUBLISHED and production-validated on 2026-08-27; exact
  immutable bytes verified on Verdaccio, official npm, and the GitHub release

Do not recommend migration to a consumer whose declared runtime includes Node
10 without an explicit runtime-floor decision. Do not claim byte-for-byte
0.5.x compatibility or a vulnerability in a current clean upstream install.
Do not promise that consumer-owned ambient TypeScript shims can be removed
without compiling that consumer against this exact candidate.

The hosted platform matrix, CodeQL, public release surfaces, official scoped
and alias consumers, production docs/catalog, and one qualified PR plus one
different qualified issue are complete. Never rebuild or republish version
`1.0.0`. Monitor maintainer responses without unsolicited follow-up.
