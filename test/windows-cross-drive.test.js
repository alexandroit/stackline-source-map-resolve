'use strict'

var assert = require('assert').strict
var path = require('path')
var test = require('node:test')
var baseline = require('source-map-resolve-baseline')
var api = require('../index.js')

test('retains the Windows drive for relative map and source reads', function () {
  var originalSeparator = path.sep
  path.sep = '\\'
  try {
    var map = { version: 3, sources: ['../src/input.ts'], mappings: '' }
    var seen = []
    var result = api.resolveSync('//# sourceMappingURL=build/index.js.map', 'D:\\projects\\test\\index.js', function (url) {
      seen.push(url)
      return /\.map$/.test(url) ? JSON.stringify(map) : 'source'
    })
    assert.deepEqual(seen, [
      'd:/projects/test/build/index.js.map',
      'd:/projects/test/src/input.ts'
    ])
    assert.equal(result.url, 'd:/projects/test/build/index.js.map')

    var upstream = baseline.resolveSourceMapSync('//# sourceMappingURL=build/index.js.map', 'D:\\projects\\test\\index.js', function () {
      return JSON.stringify(map)
    })
    assert.equal(upstream.url, '/projects/test/build/index.js.map')
  } finally {
    path.sep = originalSeparator
  }
})

test('retains a drive supplied by an absolute source URL', function () {
  var originalSeparator = path.sep
  path.sep = '\\'
  try {
    var result = api.resolveSourcesSync({ sources: ['E:\\shared\\input.ts'] }, 'D:\\maps\\app.js.map', null)
    assert.deepEqual(result.sourcesResolved, ['e:/shared/input.ts'])
  } finally {
    path.sep = originalSeparator
  }
})
