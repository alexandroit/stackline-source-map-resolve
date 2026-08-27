import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'

const source = await readFile(new URL('../dist/source-map-resolve.global.js', import.meta.url), 'utf8')
const context = {
  TextDecoder,
  Uint8Array,
  URL,
  atob: (value) => Buffer.from(value, 'base64').toString('binary'),
  clearTimeout,
  console,
  setTimeout,
  window: null
}
context.window = context
vm.runInNewContext(source, context, { filename: 'source-map-resolve.global.js' })

const api = context.SourceMapResolve.default
assert.deepEqual(Array.from(Object.keys(api)), [
  'resolveSourceMap',
  'resolveSourceMapSync',
  'resolveSources',
  'resolveSourcesSync',
  'resolve',
  'resolveSync',
  'parseMapToJSON'
])

const code = '//# sourceMappingURL=data:application/json,%7B%22version%22%3A3%2C%22sources%22%3A%5B%22input.ts%22%5D%2C%22sourcesContent%22%3A%5B%22source%22%5D%2C%22mappings%22%3A%22%22%7D'
const result = api.resolveSync(code, 'https://example.test/app.js', () => '')
assert.equal(result.map.version, 3)
assert.equal(result.sourcesResolved[0], 'https://example.test/input.ts')
assert.equal(result.sourcesContent[0], 'source')

await new Promise((resolve, reject) => {
  let returned = false
  api.resolveSourceMap('', 'https://example.test/app.js', () => {
    reject(new Error('reader should not be called'))
  }, (error, value) => {
    try {
      assert.equal(returned, true)
      assert.equal(error, null)
      assert.equal(value, null)
      resolve()
    } catch (caught) { reject(caught) }
  })
  returned = true
})

const esmSource = await readFile(new URL('../dist/source-map-resolve.browser.mjs', import.meta.url), 'utf8')
const previousWindow = globalThis.window
globalThis.window = globalThis
const browserModule = await import(`data:text/javascript;base64,${Buffer.from(esmSource).toString('base64')}`)
if (previousWindow === undefined) delete globalThis.window
else globalThis.window = previousWindow
assert.equal(typeof browserModule.default.resolveSync, 'function')
assert.equal(browserModule.resolveSync, browserModule.default.resolveSync)

console.log('Self-contained global and ESM browser artifact checks passed.')
