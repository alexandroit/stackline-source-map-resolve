# Publishing

`@stackline/source-map-resolve@1.0.1` was published on 2026-08-30 from the
single immutable tarball recorded below. Never republish or rebuild this
version. A future release must use a new version and repeat every gate.

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

The exact 1.0.1 tarball was published to Verdaccio and then once to official
npm on 2026-08-30. Both registry downloads match SHA-1
`4727eabebade91c29f0565e2a6e59330f4041a7c` and SHA-256
`fc543f0e987fa6ea6937254f27a545191e6395ab3f9f60e0c50429689af0073e`.
Post-publication work must resume from those bytes; versions `1.0.0` and
`1.0.1` are immutable.

## Maintained GitHub Actions releases

For 1.0.3 and later, require successful CI and CodeQL for the exact main-branch
commit. Review the CI artifact SHA-512 and dispatch publish.yml with ci_run_id
and expected_sha512. Publication downloads that CI archive without repacking,
checks its manifest and digest, and publishes only an absent version through
GitHub Actions with npm provenance. Direct and aliased registry consumers,
cryptographic signatures, provenance identity and exact bytes gate the
immutable GitHub release. Existing versions and tags are never replaced.
The production SBOM and actual browser material SBOM are separate release
assets. The pre-existing development fixture advisory stays explicit.
