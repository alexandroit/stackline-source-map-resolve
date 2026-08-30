# Migration

## From 0.6.0 on Node 12+

The lowest-change migration keeps the old dependency key:

```sh
npm install source-map-resolve@npm:@stackline/source-map-resolve
```

No CommonJS source change is required. Run the consumer's map-reading and
debugger tests, especially Windows paths, reader error handling, embedded maps,
and source-root overrides.

Version 1.0.1 changes no public function or import. A clean lockfile should no
longer contain `atob` or `decode-uri-component` beneath this package.

## From 0.5.3 or another 0.5.x release

Before using the alias:

1. Confirm that every supported runtime is Node 12 or newer. This release is
   not compatible with a declared Node 10 floor.
2. Confirm that the consumer does not load `source-map-resolve.js` as the exact
   historical generated UMD file. Use the new browser export or one of the
   files under `dist/` instead.
3. Exercise synchronous calls; both `Raku/nqp` and debugger integrations use
   the sync surface directly.
4. Exercise non-ASCII base64 maps and reader URLs containing spaces or `+`.
5. On Windows, expect reader paths to include their drive designator.

The shared ordinary API is differential-tested against 0.5.3, but migration is
not a claim of byte-for-byte equivalence.

## Changing imports explicitly

```diff
-const sourceMapResolve = require('source-map-resolve')
+const sourceMapResolve = require('@stackline/source-map-resolve')
```

ESM consumers may use named exports:

```js
import { resolveSourceMapSync } from '@stackline/source-map-resolve'
```

## Rollback

Restore the previous dependency specifier and lockfile, reinstall cleanly, and
rerun the same consumer tests. No persistent data is migrated by this package.
