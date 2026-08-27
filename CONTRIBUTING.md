# Contributing

1. Use a supported development runtime and install with `npm ci`.
2. Preserve the seven-function CommonJS root and add a differential or
   characterization case for every behavior change.
3. Run `npm run verify` before proposing a change.
4. Keep Node 12 runtime syntax, TypeScript 3.9 declarations, browser artifacts,
   callback scheduling, reader URLs, and error metadata covered.
5. Do not add a runtime dependency without a dated audit, license review, and
   compatibility need.

Do not include credentials, private registries, proprietary consumer fixtures,
or unlicensed source. Report vulnerabilities through [SECURITY.md](./SECURITY.md).
