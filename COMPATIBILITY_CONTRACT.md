# Compatibility Contract

## Baselines

The primary baseline is `source-map-resolve@0.6.0`. A separate `0.5.3`
baseline covers the shared ordinary API used by active direct consumers that
have not moved to 0.6.0.

The CommonJS root remains an object with exactly these enumerable keys, in
order:

1. `resolveSourceMap`
2. `resolveSourceMapSync`
3. `resolveSources`
4. `resolveSourcesSync`
5. `resolve`
6. `resolveSync`
7. `parseMapToJSON`

## Preserved behavior

- callback and synchronous readers receive decoded URL strings;
- literal `+` characters are not converted to spaces;
- embedded-map, no-map, and empty-source callbacks are deferred;
- external reads follow the scheduling supplied by the reader;
- map-read and parse errors expose partial `sourceMapData`;
- individual source-read errors occupy their `sourcesContent` slot;
- existing string `sourcesContent` values avoid a read;
- map `sourceRoot`, replacement `sourceRoot`, `sourceRoot: false`, and empty
  roots retain upstream behavior;
- `code === null` reads `codeUrl` as a map URL;
- XSSI prefixes, percent encoding, JSON MIME types, base64 UTF-8, relative,
  root-relative, scheme-relative, and absolute URLs retain upstream behavior.

## Intentional difference

On Windows, drive-letter paths retain their drive designator and use forward
slashes for resolution and reader calls. For example, a relative map beside
`D:\\project\\app.js` resolves under `d:/project/`, not the process drive.
Ordinary POSIX and network URL behavior remains differential-tested against
0.6.0.

## Additive surfaces

- real ESM default and seven named exports;
- TypeScript 3.9-compatible CommonJS declarations and modern ESM declarations;
- package export maps for root and historical `index.js` access;
- browser-condition CommonJS and ESM bundles plus a global bundle.

## 0.5.3 boundary

`0.5.3` and `0.6.0` share the seven functions and ordinary Node behavior.
Version 0.6.0 inlined `resolve-url`, `source-map-url`, and `urix`, and removed
the published browser file. Stackline follows 0.6.0 internals and restores a
new browser build. It does not promise the old UMD bytes, old dependency graph,
or Node versions below 12.

## Deliberately unchanged limitation

The source-map-comment matcher is not a JavaScript or CSS parser. Comment-like
text inside strings may match, and files with multiple directives remain
subject to the historical matcher. Consumers that know their input language
should consider extracting a directive with a language-aware parser.
