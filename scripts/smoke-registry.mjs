import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

const registry = process.env.STACKLINE_REGISTRY
assert.ok(registry, 'STACKLINE_REGISTRY is required for the post-publication registry smoke test')

const temporary = await mkdtemp(path.join(os.tmpdir(), 'stackline-source-map-resolve-registry-'))
function run (command, args) {
  const result = spawnSync(command, args, {
    cwd: temporary,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}

try {
  await writeFile(path.join(temporary, 'package.json'), JSON.stringify({
    private: true,
    dependencies: {
      '@stackline/source-map-resolve': '1.0.1',
      'source-map-resolve': 'npm:@stackline/source-map-resolve@1.0.1'
    }
  }))
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', `--registry=${registry}`])
  run(process.execPath, ['-e', [
    "const scoped = require('@stackline/source-map-resolve')",
    "const alias = require('source-map-resolve')",
    "const expected = ['resolveSourceMap','resolveSourceMapSync','resolveSources','resolveSourcesSync','resolve','resolveSync','parseMapToJSON']",
    "if (JSON.stringify(Object.keys(scoped)) !== JSON.stringify(expected)) process.exit(1)",
    "if (JSON.stringify(Object.keys(alias)) !== JSON.stringify(expected)) process.exit(1)",
    "const code = '//# sourceMappingURL=app.js.map'",
    "const read = url => /[.]map$/.test(url) ? '{\"version\":3,\"sources\":[\"input.js\"],\"sourcesContent\":[\"ok\"],\"mappings\":\"\"}' : 'ok'",
    "if (JSON.stringify(scoped.resolveSync(code, 'https://example.test/app.js', read)) !== JSON.stringify(alias.resolveSync(code, 'https://example.test/app.js', read))) process.exit(1)"
  ].join(';')])
} finally {
  await rm(temporary, { force: true, recursive: true })
}

console.log('Registry scoped and legacy-key alias checks passed.')
