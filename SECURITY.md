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

Version 1.0.1 has no production, optional, or peer dependencies. Base64 uses
the runtime primitive (`Buffer.from` in Node.js and `atob` in browsers), and
the tolerant URI decoder is maintained in-tree. A clean direct or historical
alias install must emit no dependency warnings, produce a valid npm tree, and
report zero production audit findings.

## Input boundary

This library reads locations chosen by a source map. The caller owns the reader
and must enforce its network, filesystem, protocol, size, timeout, and trust
policy. The package does not sandbox URLs or authenticate source maps.
