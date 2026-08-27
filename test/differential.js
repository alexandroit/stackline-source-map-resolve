'use strict'

var assert = require('assert').strict
var baseline053 = require('source-map-resolve-0-5-baseline')
var baseline060 = require('source-map-resolve-baseline')
var candidate = require('../index.js')

var expectedKeys = [
  'resolveSourceMap',
  'resolveSourceMapSync',
  'resolveSources',
  'resolveSourcesSync',
  'resolve',
  'resolveSync',
  'parseMapToJSON'
]

assert.deepEqual(Object.keys(candidate), expectedKeys)
assert.deepEqual(Object.keys(baseline060), expectedKeys)
assert.deepEqual(Object.keys(baseline053), expectedKeys)

var implementations = [
  ['0.6.0', baseline060],
  ['0.5.3', baseline053]
]
var comparisons = 0

function simplify (value) {
  return JSON.parse(JSON.stringify(value, function (_key, item) {
    if (item instanceof Error) return { name: item.name, message: item.message }
    return item
  }))
}

function readFor (mapText) {
  return function (url) {
    if (/\.map$/.test(url)) return mapText
    return 'content:' + url
  }
}

var commentFactories = [
  function (url) { return '//# sourceMappingURL=' + url },
  function (url) { return '//@ sourceMappingURL=' + url },
  function (url) { return '/*# sourceMappingURL=' + url + ' */' },
  function (url) { return '/*\n//# sourceMappingURL=' + url + '\n*/' }
]

for (var index = 0; index < 80; index++) {
  var map = {
    version: 3,
    file: 'bundle-' + index + '.js',
    mappings: 'AAAA',
    names: [],
    sources: [
      'source-' + index + '.js',
      'nested/source+' + index + '.js',
      '../shared-' + index + '.js'
    ]
  }
  if (index % 2 === 0) map.sourceRoot = '/assets/' + index
  if (index % 3 === 0) map.sourcesContent = ['embedded:' + index, null, null]

  var mapText = JSON.stringify(map)
  var mapName = 'bundle-' + index + '.js.map'
  var code = commentFactories[index % commentFactories.length](mapName)
  var codeUrl = 'https://example.test/build/' + index + '/bundle.js'

  implementations.forEach(function (entry) {
    var version = entry[0]
    var baseline = entry[1]
    var read = readFor(mapText)

    assert.deepEqual(
      simplify(candidate.resolveSourceMapSync(code, codeUrl, read)),
      simplify(baseline.resolveSourceMapSync(code, codeUrl, read)),
      version + ' resolveSourceMapSync case ' + index
    )
    comparisons++

    assert.deepEqual(
      simplify(candidate.resolveSourcesSync(map, codeUrl + '.map', read, index % 5 === 0 ? { sourceRoot: false } : {})),
      simplify(baseline.resolveSourcesSync(map, codeUrl + '.map', read, index % 5 === 0 ? { sourceRoot: false } : {})),
      version + ' resolveSourcesSync case ' + index
    )
    comparisons++

    assert.deepEqual(
      simplify(candidate.resolveSync(code, codeUrl, read)),
      simplify(baseline.resolveSync(code, codeUrl, read)),
      version + ' resolveSync case ' + index
    )
    comparisons++
  })
}

var parseInputs = [
  '{}',
  '{"version":3,"sources":[]}',
  ")]}'{\"version\":3,\"sources\":[\"a.js\"]}",
  '{"__proto__":{"polluted":true},"constructor":"data"}'
]

parseInputs.forEach(function (source, index) {
  implementations.forEach(function (entry) {
    assert.deepEqual(
      simplify(candidate.parseMapToJSON(source, { index: index })),
      simplify(entry[1].parseMapToJSON(source, { index: index })),
      entry[0] + ' parse case ' + index
    )
    comparisons++
  })
})

function asyncResolveSourceMap (implementation, code, codeUrl, mapText) {
  return new Promise(function (resolve, reject) {
    implementation.resolveSourceMap(code, codeUrl, function (_url, callback) {
      setImmediate(function () { callback(null, mapText) })
    }, function (error, result) {
      if (error) reject(error)
      else resolve(result)
    })
  })
}

;(async function () {
  var mapText = JSON.stringify({ version: 3, sources: ['input.ts'], mappings: '' })
  var code = '//# sourceMappingURL=output.js.map'
  for (var index = 0; index < implementations.length; index++) {
    var entry = implementations[index]
    assert.deepEqual(
      simplify(await asyncResolveSourceMap(candidate, code, 'https://example.test/output.js', mapText)),
      simplify(await asyncResolveSourceMap(entry[1], code, 'https://example.test/output.js', mapText)),
      entry[0] + ' asynchronous external-map case'
    )
    comparisons++
  }

  console.log('Differential checks passed: ' + comparisons + ' comparisons across 0.6.0 and shared 0.5.3 behavior.')
})().catch(function (error) {
  console.error(error)
  process.exitCode = 1
})
