import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = new URL('../', import.meta.url)
const output = new URL('../dist/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))

for (const file of [
  'index.js',
  'index.mjs',
  'examples/commonjs.cjs',
  'examples/esm.mjs',
  'test/runtime-compat.js',
  'test/runtime-windows.js'
]) {
  execFileSync(process.execPath, ['--check', fileURLToPath(new URL(file, root))], {
    stdio: 'inherit'
  })
}

const runtime = manifest.dependencies || {}
if (runtime.atob !== '2.1.2' || runtime['decode-uri-component'] !== '0.2.2') {
  throw new Error('Runtime dependencies must remain exact-pinned to the audited patched versions.')
}
if (Object.keys(manifest.optionalDependencies || {}).length !== 0 || Object.keys(manifest.peerDependencies || {}).length !== 0) {
  throw new Error('Optional and peer dependency counts must remain zero.')
}

await mkdir(output, { recursive: true })

const shared = {
  alias: {
    path: 'path-browserify',
    url: 'url'
  },
  bundle: true,
  legalComments: 'eof',
  minify: true,
  platform: 'browser',
  target: ['es2018']
}

await Promise.all([
  build({
    ...shared,
    entryPoints: [fileURLToPath(new URL('index.mjs', root))],
    format: 'cjs',
    outfile: fileURLToPath(new URL('source-map-resolve.browser.cjs', output))
  }),
  build({
    ...shared,
    entryPoints: [fileURLToPath(new URL('index.mjs', root))],
    format: 'esm',
    outfile: fileURLToPath(new URL('source-map-resolve.browser.mjs', output))
  }),
  build({
    ...shared,
    entryPoints: [fileURLToPath(new URL('index.mjs', root))],
    format: 'iife',
    globalName: 'SourceMapResolve',
    outfile: fileURLToPath(new URL('source-map-resolve.global.js', output))
  })
])

await writeFile(new URL('build-meta.json', output), `${JSON.stringify({
  browserArtifacts: 3,
  name: manifest.name,
  optionalDependencies: 0,
  peerDependencies: 0,
  runtimeDependencies: runtime,
  version: manifest.version
}, null, 2)}\n`, 'utf8')

console.log(`Built and validated ${manifest.name}@${manifest.version}.`)
