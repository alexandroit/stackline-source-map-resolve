'use strict'

var assert = require('assert').strict
var test = require('node:test')
var api = require('../index.js')

test('scans a two-million-character no-map input without recursion or failure', function () {
  var code = 'const value = "' + 'x'.repeat(2000000) + '";'
  assert.equal(api.resolveSourceMapSync(code, 'https://example.test/app.js', function () {}), null)
})

test('resolves ten thousand source URLs without reading when read is null', function () {
  var sources = []
  for (var index = 0; index < 10000; index++) sources.push('src/' + index + '.js')
  var result = api.resolveSourcesSync({ sources: sources }, 'https://example.test/maps/app.js.map', null)
  assert.equal(result.sourcesResolved.length, 10000)
  assert.equal(result.sourcesResolved[9999], 'https://example.test/maps/src/9999.js')
  assert.deepEqual(result.sourcesContent, [])
})

test('resolves two thousand embedded sources asynchronously', async function () {
  var sources = []
  var content = []
  for (var index = 0; index < 2000; index++) {
    sources.push('src/' + index + '.js')
    content.push('content-' + index)
  }
  await new Promise(function (resolve, reject) {
    api.resolveSources({ sources: sources, sourcesContent: content }, 'https://example.test/app.js.map', function () {
      reject(new Error('reader should not run for embedded content'))
    }, function (error, result) {
      try {
        assert.equal(error, null)
        assert.equal(result.sourcesContent.length, 2000)
        assert.equal(result.sourcesContent[1999], 'content-1999')
        resolve()
      } catch (caught) { reject(caught) }
    })
  })
})
