import assertModule from 'assert'
import api, {
  parseMapToJSON,
  resolve,
  resolveSourceMap,
  resolveSourceMapSync,
  resolveSources,
  resolveSourcesSync,
  resolveSync
} from '../index.mjs'

const assert = assertModule.strict

assert.deepEqual(Object.keys(api), [
  'resolveSourceMap',
  'resolveSourceMapSync',
  'resolveSources',
  'resolveSourcesSync',
  'resolve',
  'resolveSync',
  'parseMapToJSON'
])
assert.equal(api.resolveSourceMap, resolveSourceMap)
assert.equal(api.resolveSourceMapSync, resolveSourceMapSync)
assert.equal(api.resolveSources, resolveSources)
assert.equal(api.resolveSourcesSync, resolveSourcesSync)
assert.equal(api.resolve, resolve)
assert.equal(api.resolveSync, resolveSync)
assert.equal(api.parseMapToJSON, parseMapToJSON)

const code = '//# sourceMappingURL=data:application/json,%7B%22version%22%3A3%2C%22sources%22%3A%5B%5D%2C%22mappings%22%3A%22%22%7D'
assert.equal(resolveSourceMapSync(code, 'https://example.test/app.js', () => {}).map.version, 3)

console.log('ESM default and seven named export checks passed.')
