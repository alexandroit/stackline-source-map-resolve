'use strict'

var assert = require('assert').strict
var test = require('node:test')
var api = require('../index.js')

test('accepts XSSI-prefixed maps without mutating object prototypes', function () {
  var map = api.parseMapToJSON(")]}'{\"__proto__\":{\"polluted\":true},\"sources\":[]}")
  assert.equal(Object.prototype.polluted, undefined)
  assert.equal(Object.prototype.hasOwnProperty.call(map, '__proto__'), true)
  assert.equal(map.__proto__.polluted, true)
})

test('annotates malformed encoded data URIs', function () {
  var cases = [
    ['//# sourceMappingURL=data:text/html,{}', /mime type.+text\/html/],
    ['//# sourceMappingURL=data:application/json,%', /URI malformed/],
    ['//# sourceMappingURL=data:application/json,not-json', /Unexpected token|JSON/],
    ['//# sourceMappingURL=data:application/json;base64,YWJj', /encoded data was not valid|Unexpected token|JSON/]
  ]
  cases.forEach(function (entry) {
    assert.throws(function () {
      api.resolveSourceMapSync(entry[0], 'https://example.test/app.js', function () {
        throw new Error('reader must not be called')
      })
    }, function (error) {
      assert.match(error.message, entry[1])
      assert.equal(typeof error.sourceMapData, 'object')
      return true
    })
  })
})

test('does not interpret sourceMappingURL-like text inside quoted strings as a security guarantee', function () {
  var code = 'const text = "//# sourceMappingURL=looks-like-a-map"'
  var result = api.resolveSourceMapSync(code, 'https://example.test/app.js', function () { return '{}' })
  assert.equal(result.sourceMappingURL, 'looks-like-a-map')
  assert.equal(result.url, 'https://example.test/looks-like-a-map')
})

test('handles missing and empty source lists', async function () {
  assert.deepEqual(api.resolveSourcesSync({}, 'https://example.test/app.js.map', null), {
    sourcesResolved: [],
    sourcesContent: []
  })
  await new Promise(function (resolve, reject) {
    var returned = false
    api.resolveSources({ sources: [] }, 'https://example.test/app.js.map', function () {
      reject(new Error('reader should not run'))
    }, function (error, result) {
      try {
        assert.equal(returned, true)
        assert.equal(error, null)
        assert.deepEqual(result, { sourcesResolved: [], sourcesContent: [] })
        resolve()
      } catch (caught) { reject(caught) }
    })
    returned = true
  })
})
