# @stackline/source-map-resolve

A compatibility-first maintained continuation of
[`source-map-resolve@0.6.0`](https://www.npmjs.com/package/source-map-resolve).
It locates a `sourceMappingURL`, reads an external or embedded source map, and
optionally resolves and reads the map's sources.

This project is independent. It is not affiliated with or endorsed by Simon
Lydell or the upstream project.

## Compatibility target

- the same seven enumerable CommonJS functions as upstream `0.6.0`;
- synchronous and callback reader APIs, including their scheduling behavior;
- partial `error.sourceMapData` metadata for map read and parse failures;
- external, percent-encoded, JSON data-URI, base64, and XSSI-prefixed maps;
- embedded and reader-provided source content, `sourceRoot` overrides, and
  direct map-URL mode (`code === null`);
- Node.js 12 or newer;
- additive ESM named exports, TypeScript declarations, and self-contained
  browser artifacts.

The only intentional resolver correction in `1.0.0` preserves Windows drive
letters. Upstream stripped `D:` from a path and could consequently ask a
reader on `C:` for the wrong file.

## Install

```sh
npm install @stackline/source-map-resolve
```

To keep an existing import unchanged after publication, use an npm alias:

```sh
npm install source-map-resolve@npm:@stackline/source-map-resolve
```

```js
const sourceMapResolve = require('source-map-resolve')
```

The legacy-key alias changes package resolution only; application imports do
not need to change.

Version 1.0.1 installs with no production, optional, or peer dependencies.
Base64 decoding uses the runtime primitive, and tolerant URI decoding is
maintained inside the package under its retained MIT attribution.

## CommonJS

```js
const sourceMapResolve = require('@stackline/source-map-resolve')
const fs = require('node:fs')

const result = sourceMapResolve.resolveSync(
  fs.readFileSync('dist/app.js', 'utf8'),
  'dist/app.js',
  fs.readFileSync
)

console.log(result && result.sourcesResolved)
```

## ESM

```js
import { resolveSourceMapSync } from '@stackline/source-map-resolve'

const result = resolveSourceMapSync(code, codeUrl, readSync)
```

The default ESM export is the same seven-function API object as CommonJS.

## API

### `resolveSourceMap(code, codeUrl, read, callback)`

Find and parse the first recognized `sourceMappingURL`. `read(url, callback)`
is used only for an external map. No-map, embedded-map, and helper errors are
delivered asynchronously.

### `resolveSourceMapSync(code, codeUrl, read)`

Synchronous form. It returns `null` when no recognized comment exists.

### `resolveSources(map, mapUrl, read, [options], callback)`

Resolve every `map.sources` entry. Existing string entries in
`map.sourcesContent` are retained. A failure to read one source is placed in
the corresponding `sourcesContent` slot rather than failing the whole call.

### `resolveSourcesSync(map, mapUrl, read, [options])`

Synchronous form. Pass `read === null` to resolve URLs without reading source
content.

### `resolve(code, codeUrl, read, [options], callback)`

Resolve the map and its sources. When `code === null`, `codeUrl` is treated as
the map URL and read directly.

### `resolveSync(code, codeUrl, read, [options])`

Synchronous combined resolver.

### `parseMapToJSON(source, [partialData])`

Parse JSON after removing the source-map XSSI prefix `)]}'`. Parse errors retain
the supplied value as `error.sourceMapData`.

### Options

`sourceRoot` may be a replacement string or `false` to ignore the map's own
`sourceRoot`.

## Browser use

Bundlers can select the package's `browser` export condition. Direct artifacts
are also available:

- `dist/source-map-resolve.browser.mjs`
- `dist/source-map-resolve.browser.cjs`
- `dist/source-map-resolve.global.js` (`SourceMapResolve`)

Browser callers provide their own asynchronous or synchronous reader, such as
one backed by `fetch`, an in-memory file table, or an application filesystem.

## Important limitation

The historical matcher is deliberately language-agnostic. Text that looks like
a source-map comment inside a string can be matched. Browser engines also
differ on which comment wins when a file contains multiple directives. This
release preserves upstream `0.6.0` behavior; it does not claim to parse every
JavaScript or CSS grammar.

## Consumers pinned to 0.5.x

The shared seven-function API and ordinary Node resolver behavior are tested
against both `0.5.3` and `0.6.0`. However, this is a `0.6.0` compatibility
release, not a byte-for-byte `0.5.x` clone:

- upstream `0.5.3` shipped a generated UMD browser file; upstream `0.6.0`
  removed it and inlined the old URL helper packages;
- both versions include the `0.5.3` UTF-8 base64 fix when `TextDecoder` and
  `Uint8Array` exist;
- this package restores a newly built and tested browser artifact rather than
  reproducing the old generated UMD bytes;
- this package requires Node 12. A consumer supporting Node 10 or older must
  raise its runtime floor before migration;
- the Windows drive-letter correction intentionally differs from both
  historical versions.

See [COMPATIBILITY_CONTRACT.md](./COMPATIBILITY_CONTRACT.md) and
[MIGRATION.md](./MIGRATION.md) before migrating a 0.5.x consumer.

## Security

The production graph contains only this package. Release gates require a
warning-free packed install, a valid npm tree, and zero production audit
findings for both direct and historical-key alias consumers. Report suspected
vulnerabilities privately as described in [SECURITY.md](./SECURITY.md).

## License

MIT. Upstream copyright and attribution are retained in [LICENSE](./LICENSE),
[NOTICE](./NOTICE), and [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).
