import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const run = (args) => spawnSync(npm, args, { encoding: 'utf8' })
const production = run(['audit', '--omit=dev', '--json'])
assert.equal(production.status, 0, production.stdout + production.stderr)

const result = run(['audit', '--json'])
assert.equal(result.error, undefined)
assert.equal(result.signal, null)
const audit = JSON.parse(result.stdout)
assert.equal(audit.error, undefined, JSON.stringify(audit.error))
if (result.status === 0) {
  console.log('Full dependency audit reported no advisories.')
} else {
  assert.equal(result.status, 1, 'Unexpected npm audit exit status')
  assert(Object.keys(audit.vulnerabilities).length > 0, 'Expected explicit advisory details')
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'))
  assert.equal(manifest.devDependencies['source-map-resolve-baseline'], 'npm:source-map-resolve@0.6.0')
  assert.equal(manifest.devDependencies['source-map-resolve-0-5-baseline'], 'npm:source-map-resolve@0.5.3')
  const allowedNodes = new Set([
    'node_modules/decode-uri-component',
    'node_modules/source-map-resolve-baseline',
    'node_modules/source-map-resolve-0-5-baseline'
  ])
  const allowedPackages = new Set(['decode-uri-component', 'source-map-resolve'])
  for (const [name, finding] of Object.entries(audit.vulnerabilities)) {
    assert(allowedPackages.has(name), `Unexpected vulnerable package: ${name}`)
    for (const node of finding.nodes) {
      assert(allowedNodes.has(node), `Unexpected vulnerable dependency path: ${node}`)
      assert.equal(lock.packages[node].dev, true, `${node} must remain development-only`)
    }
    for (const via of finding.via) {
      if (typeof via === 'string') {
        assert(allowedPackages.has(via), `Unexpected advisory dependency: ${via}`)
      } else {
        assert.equal(via.url, 'https://github.com/advisories/GHSA-vcc3-ghjq-m6fr')
      }
    }
  }
  console.warn('Known development-only baseline advisory: GHSA-vcc3-ghjq-m6fr. The frozen upstream comparison fixtures retain their historical decoder; production audit is clean. See DEPENDENCY_DECISIONS.md.')
}
