'use strict'

var assert = require('assert').strict
var manifest = require('../package.json')
var direct = require('../index.js')

assert.equal(manifest.name, '@stackline/source-map-resolve')
assert.equal(manifest.engines.node, '>=12')
assert.equal(manifest.dependencies, undefined)
assert.equal(manifest.optionalDependencies, undefined)
assert.equal(manifest.peerDependencies, undefined)
assert.deepEqual(Object.keys(direct), [
  'resolveSourceMap',
  'resolveSourceMapSync',
  'resolveSources',
  'resolveSourcesSync',
  'resolve',
  'resolveSync',
  'parseMapToJSON'
])

var result = direct.resolveSync(
  '//# sourceMappingURL=app.js.map',
  'https://example.test/dist/app.js',
  function (url) {
    if (/\.map$/.test(url)) return '{"version":3,"sources":["../src/app.ts"],"mappings":""}'
    return 'source'
  }
)
assert.deepEqual(result.sourcesResolved, ['https://example.test/src/app.ts'])
assert.deepEqual(result.sourcesContent, ['source'])

console.log('Runtime compatibility checks passed on Node ' + process.version + '.')
