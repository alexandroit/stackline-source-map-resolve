import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import os from 'node:os'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-source-map-resolve-pack-'))
let tarball

function run (command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || temporary,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return result
}

try {
  const packed = run('npm', ['pack', '--json', '--ignore-scripts'], { cwd: root })
  const packResult = JSON.parse(packed.stdout)[0]
  tarball = path.join(root, packResult.filename)
  const paths = packResult.files.map((file) => file.path)

  for (const required of [
    'CHANGELOG.md',
    'COMPATIBILITY_CONTRACT.md',
    'LICENSE',
    'MIGRATION.md',
    'NOTICE',
    'README.md',
    'SECURITY.md',
    'THIRD_PARTY_LICENSES.md',
    'dist/source-map-resolve.browser.cjs',
    'dist/source-map-resolve.browser.mjs',
    'dist/source-map-resolve.global.js',
    'index.js',
    'index.mjs',
    'index.d.ts',
    'index.d.cts',
    'index.d.mts',
    'examples/commonjs.cjs',
    'examples/esm.mjs'
  ]) assert.equal(paths.includes(required), true, `missing packed file: ${required}`)

  for (const excluded of ['UPSTREAM_AUDIT.md', 'PROJECT_MEMORY.md', 'DEPENDENCY_DECISIONS.md', 'REGISTRY_HANDOFF.md', 'PUBLISHING.md']) {
    assert.equal(paths.includes(excluded), false, `private handoff file was packed: ${excluded}`)
  }
  assert.equal(paths.some((file) => file.startsWith('test/')), false)
  assert.equal(paths.some((file) => file.startsWith('scripts/')), false)

  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
    dependencies: {
      '@stackline/source-map-resolve': `file:${tarball}`
    }
  }))
  const installation = run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'])
  assert.doesNotMatch(installation.stdout + installation.stderr, /\b(?:warn(?:ing)?|deprecated)\b/i)

  run(process.execPath, ['--input-type=commonjs', '-e', [
    "const api = require('@stackline/source-map-resolve')",
    "const deep = require('@stackline/source-map-resolve/index.js')",
    "if (api !== deep || Object.keys(api).length !== 7) process.exit(1)",
    "const code = '//# sourceMappingURL=data:application/json,%7B%22sources%22%3A%5B%5D%7D'",
    "if (!api.resolveSourceMapSync(code, 'https://example.test/a.js', () => '')) process.exit(1)"
  ].join(';')])

  await writeFile(path.join(temporary, 'consumer.mjs'), [
    "import api, { resolveSync } from '@stackline/source-map-resolve'",
    "if (api.resolveSync !== resolveSync) process.exit(1)",
    "const result = resolveSync(null, 'https://example.test/app.js.map', (url) => /\\.map$/.test(url) ? '{\"sources\":[]}' : '')",
    "if (!result || result.sourcesResolved.length !== 0) process.exit(1)"
  ].join('\n'))
  run(process.execPath, ['consumer.mjs'])

  const installed = path.join(temporary, 'node_modules', '@stackline', 'source-map-resolve')
  run(process.execPath, [path.join(installed, 'examples', 'commonjs.cjs')])
  run(process.execPath, [path.join(installed, 'examples', 'esm.mjs')])

  const installedManifest = JSON.parse(await readFile(path.join(installed, 'package.json'), 'utf8'))
  assert.equal(installedManifest.version, '1.0.3')
  assert.equal(installedManifest.dependencies, undefined)
  assert.equal(installedManifest.optionalDependencies, undefined)
  assert.equal(installedManifest.peerDependencies, undefined)
  const tree = JSON.parse(run('npm', ['ls', '--omit=dev', '--all', '--json']).stdout)
  assert.equal(tree.problems, undefined)
  assert.deepEqual(tree.dependencies, {
    '@stackline/source-map-resolve': {
      version: '1.0.3',
      resolved: `file:${tarball}`,
      overridden: false
    }
  })
  const audit = JSON.parse(run('npm', ['audit', '--omit=dev', '--json']).stdout)
  assert.equal(audit.metadata.vulnerabilities.total, 0)
} finally {
  if (tarball) await rm(tarball, { force: true })
  await rm(temporary, { force: true, recursive: true })
}

console.log('Packed CJS, ESM, deep-entry, examples, inventory, and zero-dependency production checks passed.')
