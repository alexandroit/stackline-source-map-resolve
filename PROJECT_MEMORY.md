---
schema: stackline-project-memory-v1
package: source-map-resolve
target: "@stackline/source-map-resolve"
version: 1.0.0
state: PUBLISHED
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
See `VERIFICATION.md` for the complete local and public gates.

## Registry checkpoint — 2026-08-27

The single 76,129-byte artifact was published to Verdaccio and once to
official npm. Both public tarball bytes match the local artifact. Anonymous npm
packument propagation returned a transient `E404` immediately afterward while
public access, `latest: 1.0.0`, and the official tarball were already confirmed.
Propagation then completed and clean scoped plus legacy-alias consumers passed.
Do not republish.

## Production completion — 2026-08-27T22:15:29Z

State transitioned from `BUILDING` to `PUBLISHED` after all required surfaces
passed:

- npm: https://www.npmjs.com/package/@stackline/source-map-resolve
- source: https://github.com/alexandroit/stackline-source-map-resolve
- immutable eight-asset release:
  https://github.com/alexandroit/stackline-source-map-resolve/releases/tag/stackline-v1.0.0
- documentation: https://alexandro.net/docs/vanilla/source-map-resolve/
- catalog: https://alexandro.net/docs/open-source/

The public repository has only `main`; its release and final documentation
commits passed the 14-job Ubuntu/Windows Node 12–24 matrix and CodeQL. The
release tarball downloaded from GitHub matches both registries. Production
documentation and catalog browser checks pass at desktop/mobile widths, the
live workbench resolves its embedded map, and both aggregate sitemaps contain
the five package routes.

The cycle's qualified adoption contacts are
`microsoft/vscode-react-native#2900` (migration PR) and
`javascript-obfuscator/javascript-obfuscator#1446` (maintainer-decision issue).
No follow-up is authorized unless a maintainer asks a concrete question.
