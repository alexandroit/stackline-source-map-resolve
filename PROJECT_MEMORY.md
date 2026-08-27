---
schema: stackline-project-memory-v1
package: source-map-resolve
target: "@stackline/source-map-resolve"
version: 1.0.0
state: VERIFIED_LOCAL
updated: 2026-08-27
---

# Project Memory

## Decision

GO is frozen in [UPSTREAM_AUDIT.md](./UPSTREAM_AUDIT.md). The implementation
targets upstream 0.6.0 and separately characterizes shared 0.5.3 behavior for
active direct consumers.

## Compatibility boundary

Preserve the seven CommonJS functions, sync/callback readers, scheduling,
partial error metadata, map/source resolution, data URI and XSSI behavior.
Add ESM, types, and browser builds. Correct only Windows drive-letter loss.

## Release boundary

Node is `>=12`. Runtime dependencies are exact `atob@2.1.2` and
`decode-uri-component@0.2.2`. No package version, GitHub repository, release,
registry write, or production deployment has been created from this workspace.

## Local verification

The complete `npm run verify` gate passed on 2026-08-27. A locally prepared,
unpublished release candidate is frozen under `release-candidate/` with
SHA-256 `77a62ce17a2a490d1c7525185216151ef60279634b37716f278a6f376aa17769`.
See `VERIFICATION.md` for the tested lanes and remaining external gates.
