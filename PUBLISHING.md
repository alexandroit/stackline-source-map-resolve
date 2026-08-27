# Publishing

Publication is not authorized by this workspace state.

## Release gate

```sh
npm ci
npm run verify
```

Run the supported Node 12, 14, 16, 18, 20, 22, and 24 runtime matrix and all
platform jobs before creating a release artifact.

## Immutable artifact

After review, `npm run artifact:prepare` creates `release-candidate/` exactly
once and refuses to overwrite it. The directory contains one tarball, SHA-1,
SHA-256, SHA-512 files, the complete npm inventory, a release manifest, and a
CycloneDX production SBOM.

Publish those exact bytes to the staging registry first and verify scoped plus
legacy-key alias consumers. Only separately authorized release work may publish
the same bytes to official npm, create a GitHub release, or deploy production
documentation. Never rebuild between registries or republish an existing
version.
