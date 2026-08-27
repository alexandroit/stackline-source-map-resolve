# Third-Party Licenses

## source-map-resolve

- Upstream: <https://github.com/lydell/source-map-resolve>
- Compatibility baseline: `source-map-resolve@0.6.0`
- Additional shared-surface baseline: `source-map-resolve@0.5.3`
- Authors: Simon Lydell and ZHAO Jinxiang
- License: MIT

The complete upstream notice is retained in [LICENSE](./LICENSE). Licensed
upstream tests remain development evidence and are excluded from the npm
artifact.

## Production dependency graph

| Package | Version | License | Purpose | Source |
| --- | --- | --- | --- | --- |
| `atob` | 2.1.2 | MIT OR Apache-2.0 | Base64 decoding compatibility | <https://git.coolaj86.com/coolaj86/atob.js> |
| `decode-uri-component` | 0.2.2 | MIT | Tolerant URL component decoding | <https://github.com/SamVerschueren/decode-uri-component> |

Both packages install their complete license files alongside their source.
The release license gate verifies those files and exact versions, and the
CycloneDX SBOM records both runtime relationships. There are no optional or
peer dependencies.
