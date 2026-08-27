---
schema: stackline-project-memory-v1
package: source-map-resolve
target: "@stackline/source-map-resolve"
version: 1.0.0
state: BUILDING
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
`decode-uri-component@0.2.2`.

## Local verification

The complete `npm run verify` gate passed on 2026-08-27. The release artifact
is frozen under `release-candidate/` with
SHA-256 `77a62ce17a2a490d1c7525185216151ef60279634b37716f278a6f376aa17769`.
See `VERIFICATION.md` for the tested lanes and remaining external gates.

## Registry checkpoint — 2026-08-27

The single 76,129-byte artifact was published to Verdaccio and once to
official npm. Both public tarball bytes match the local artifact. Anonymous npm
packument propagation was still returning a transient `E404` immediately
afterward, while public access, `latest: 1.0.0`, and the official tarball were
already confirmed. Do not republish. GitHub release, production docs, clean
official metadata consumers, and adoption remain before the final `PUBLISHED`
transition.
