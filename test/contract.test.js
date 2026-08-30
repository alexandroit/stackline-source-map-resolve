'use strict'

var assert = require('assert').strict
var test = require('node:test')
var api = require('../index.js')

test('exports exactly the seven-function compatibility surface', function () {
  assert.deepEqual(Object.keys(api), [
    'resolveSourceMap',
    'resolveSourceMapSync',
    'resolveSources',
    'resolveSourcesSync',
    'resolve',
    'resolveSync',
    'parseMapToJSON'
  ])
  Object.keys(api).forEach(function (name) { assert.equal(typeof api[name], 'function') })
})

test('defers no-map and embedded-map callbacks', async function () {
  var returned = false
  await new Promise(function (resolve, reject) {
    api.resolveSourceMap('', 'https://example.test/app.js', function () {
      reject(new Error('reader should not be called'))
    }, function (error, result) {
      try {
        assert.equal(returned, true)
        assert.equal(error, null)
        assert.equal(result, null)
        resolve()
      } catch (caught) { reject(caught) }
    })
    returned = true
  })
})

test('retains partial sourceMapData for map read and parse errors', async function () {
  var readFailure = new Error('map unavailable')
  await new Promise(function (resolve, reject) {
    api.resolveSourceMap('//# sourceMappingURL=app.js.map', 'https://example.test/app.js', function (_url, callback) {
      callback(readFailure)
    }, function (error) {
      try {
        assert.equal(error, readFailure)
        assert.deepEqual(error.sourceMapData, {
          sourceMappingURL: 'app.js.map',
          url: 'https://example.test/app.js.map',
          sourcesRelativeTo: 'https://example.test/app.js.map',
          map: null
        })
        resolve()
      } catch (caught) { reject(caught) }
    })
  })

  assert.throws(function () {
    api.resolveSourceMapSync('//# sourceMappingURL=app.js.map', 'https://example.test/app.js', function () {
      return 'not json'
    })
  }, function (error) {
    assert.equal(error.name, 'SyntaxError')
    assert.equal(error.sourceMapData.map, 'not json')
    return true
  })
})

test('stores individual source read failures instead of failing the operation', function () {
  var failure = new Error('source unavailable')
  var result = api.resolveSourcesSync({
    sources: ['embedded.js', 'missing.js'],
    sourcesContent: ['embedded', null]
  }, 'https://example.test/app.js.map', function (url) {
    if (/missing\.js$/.test(url)) throw failure
    return 'unexpected'
  })
  assert.equal(result.sourcesContent[0], 'embedded')
  assert.equal(result.sourcesContent[1], failure)
})

test('supports direct map URL mode and sourceRoot overrides', function () {
  var map = { version: 3, sourceRoot: '/old', sources: ['input.ts'], mappings: '' }
  var seen = []
  var result = api.resolveSync(null, 'https://example.test/maps/app.js.map', function (url) {
    seen.push(url)
    return /\.map$/.test(url) ? JSON.stringify(map) : 'source'
  }, { sourceRoot: '/new' })
  assert.deepEqual(seen, [
    'https://example.test/maps/app.js.map',
    'https://example.test/new/input.ts'
  ])
  assert.deepEqual(result.sourcesResolved, ['https://example.test/new/input.ts'])
  assert.deepEqual(result.sourcesContent, ['source'])
})

test('decodes URL paths while preserving literal plus signs', function () {
  var seen
  api.resolveSourceMapSync('//# sourceMappingURL=maps%20and+plus/app.js.map', 'https://example.test/out.js', function (url) {
    seen = url
    return '{}'
  })
  assert.equal(seen, 'https://example.test/maps and+plus/app.js.map')
})

test('preserves tolerant URI decoding across valid and malformed byte sequences', function () {
  var cases = [
    ['hello%20world.map', 'hello world.map'],
    ['a+b.map', 'a+b.map'],
    ['%G0.map', '%G0.map'],
    ['%C3%A5.map', '\u00E5.map'],
    ['%E0%A4%A.map', '%E0%A4%A.map'],
    ['%FE%FF.map', '\uFFFD\uFFFD.map'],
    ['%fe%ff.map', '%fe%ff.map'],
    ['%C2.map', '\uFFFD.map'],
    ['%c2.map', '%c2.map'],
    ['%80.map', '%80.map'],
    ['%F0%9F%92%A9.map', '\uD83D\uDCA9.map'],
    ['a%20b%ZZc.map', 'a b%ZZc.map']
  ]

  cases.forEach(function (entry) {
    var seen
    api.resolveSourceMapSync('//# sourceMappingURL=' + entry[0], 'https://example.test/', function (url) {
      seen = url
      return '{}'
    })
    assert.equal(seen, 'https://example.test/' + entry[1])
  })
})

test('decodes UTF-8 base64 maps without an installed atob package', function () {
  var map = JSON.stringify({ version: 3, sources: ['f\u00F8\u00F8.ts'], mappings: '' })
  var encoded = Buffer.from(map, 'utf8').toString('base64')
  var result = api.resolveSourceMapSync(
    '//# sourceMappingURL=data:application/json;base64,' + encoded,
    'https://example.test/app.js',
    function () { throw new Error('reader should not run') }
  )
  assert.deepEqual(result.map, JSON.parse(map))
})
