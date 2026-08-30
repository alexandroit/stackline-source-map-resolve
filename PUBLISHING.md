# Publishing

`@stackline/source-map-resolve@1.0.0` has already been published from the
immutable tarball recorded below. Never republish or rebuild this version.

Version 1.0.1 is the dependency-closure remediation. It may be published only
from a new immutable artifact after the full platform matrix proves the empty
production graph, direct and alias installs emit no warnings, `npm ls` reports
no problems, and `npm audit --omit=dev` reports zero vulnerabilities.

## Release gate

```sh
npm ci
npm run verify
```

Run the supported Node 12, 14, 16, 18, 20, 22, and 24 runtime matrix and all
platform jobs before creating a release artifact.

## Immutable artifact

For each version, `npm run artifact:prepare` creates `release-candidate/`
exactly once. The
directory contains one tarball, SHA-1, SHA-256, SHA-512 files, the complete npm
inventory, a release manifest, and a CycloneDX production SBOM.

The exact tarball was published to Verdaccio and then once to official npm on
2026-08-27. Both registry downloads match SHA-1
`a886d7156121d4b57dcb69b35b6033ef1385585c` and SHA-256
`77a62ce17a2a490d1c7525185216151ef60279634b37716f278a6f376aa17769`.
Post-publication work must resume from those bytes; version `1.0.0` is
immutable.
