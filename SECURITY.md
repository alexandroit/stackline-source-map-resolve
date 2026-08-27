# Security

Report suspected vulnerabilities privately through the GitHub security
advisory form for `alexandroit/stackline-source-map-resolve`. Do not disclose an
unfixed vulnerability in a public issue.

Include the affected version, reproduction, impact, runtime, reader behavior,
and any suggested fix. Maintainers will coordinate disclosure after validating
the report and preparing a release.

## Supported line

The latest published `1.x` release is supported on Node 12 and newer.

## Dependency statement

Production dependencies are exact-pinned to `atob@2.1.2` and
`decode-uri-component@0.2.2`. Both are the audited patched versions and a clean
production install currently has no known npm audit finding. Historical
advisories affecting older versions must not be represented as vulnerabilities
in a current clean upstream installation.

## Input boundary

This library reads locations chosen by a source map. The caller owns the reader
and must enforce its network, filesystem, protocol, size, timeout, and trust
policy. The package does not sandbox URLs or authenticate source maps.
