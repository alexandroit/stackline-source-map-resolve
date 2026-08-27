# Adoption Targets

This is a pre-contact compatibility note, not evidence of consumer approval.

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
