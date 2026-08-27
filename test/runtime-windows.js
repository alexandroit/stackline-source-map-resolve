'use strict'

// Dependency-free and node:test-free so the declared Node 12 floor can run it.
var assert = require('assert').strict
var path = require('path')
var api = require('../index.js')

var originalDescriptor = Object.getOwnPropertyDescriptor(path, 'sep')
Object.defineProperty(path, 'sep', { configurable: true, value: '\\' })

try {
  var reads = []
  var result = api.resolveSync(
    '//# sourceMappingURL=maps\\app.js.map',
    'D:\\project\\dist\\app.js',
    function (url) {
      reads.push(url)
      if (/\.map$/.test(url)) {
        return JSON.stringify({ version: 3, sources: ['..\\src\\input.ts'], mappings: '' })
      }
      return 'source'
    }
  )

  assert.deepEqual(reads, [
    'd:/project/dist/maps/app.js.map',
    'd:/project/dist/src/input.ts'
  ])
  assert.deepEqual(result.sourcesResolved, ['d:/project/dist/src/input.ts'])
} finally {
  Object.defineProperty(path, 'sep', originalDescriptor)
}

console.log('Dependency-free Windows drive-letter runtime contract passed.')
