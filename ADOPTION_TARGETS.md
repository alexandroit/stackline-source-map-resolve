# Adoption Targets

This is a pre-contact compatibility note, not evidence of consumer approval.

## Contacted — 2026-08-27

- `microsoft/vscode-react-native`: qualified migration PR
  [#2900](https://github.com/microsoft/vscode-react-native/pull/2900) is open.
  It changes only `package.json` and `package-lock.json` to the exact alias
  `source-map-resolve: npm:@stackline/source-map-resolve@1.0.0`. The target's
  imports, Windows workaround, ambient type declaration, and test registration
  remain unchanged. Clean install, build, gulp, focused combinator, full test,
  and localization gates passed. Maintainer relationship and compatibility
  limitations are disclosed in the PR.
- `javascript-obfuscator/javascript-obfuscator`: qualified maintainer-decision
  issue [#1446](https://github.com/javascript-obfuscator/javascript-obfuscator/issues/1446)
  is open in this different repository. It identifies the exact dev dependency
  and `resolveSources` test usage, asks whether an exact alias plus lockfile
  migration is welcome, retains the repository's ambient declaration, proposes
  the repository's build/coverage gates, discloses Stackline maintainership,
  and offers staying on 0.6.0 or a narrower implementation as neutral options.

## Consumers pinned to 0.5.x

- `microsoft/vscode-react-native` pins `source-map-resolve@0.5.3`. Its ordinary
  synchronous use is covered by the 0.5.3 characterization lane, but its local
  ambient declaration must remain until its TypeScript build proves that the
  first-party `RawSourceMap` type works with its older `source-map` types.
- `Raku/nqp` allows `source-map-resolve@^0.5.1` and supports Node 10.10. It is
  runtime-blocked because Stackline's contract is Node 12 or newer. Do not
  propose migration unless that project first raises its runtime floor.
- Consumers with local declarations that require a `resolveSources` result
  must retain their guards or declarations: the callback result correctly can
  be absent when an error is delivered.

## Contact gate

Do not describe the old browser bytes, dependency graph, Node 10 behavior, or
ambient type-shim removal as drop-in compatible. Contact begins only after the
package artifact has an immutable digest and the consumer's own build/tests
pass against that exact artifact.
