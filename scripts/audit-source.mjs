import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const decoder = 'node_modules/decode-uri-component'
const baselines = {
  'node_modules/source-map-resolve-baseline': '0.6.0',
  'node_modules/source-map-resolve-0-5-baseline': '0.5.3'
}
const reviewed = new Map([
  ['https://github.com/advisories/GHSA-vcc3-ghjq-m6fr', { severity: 'moderate', range: '<=0.4.2' }],
  ['https://github.com/advisories/GHSA-qr28-fpjm-wq7f', { severity: 'high', range: '<=0.5.0' }]
])

export function reviewBaselineAudit (audit, manifest, lock, browserInputs, today = new Date().toISOString().slice(0, 10)) {
  assert.equal(audit.error, undefined, JSON.stringify(audit.error))
  assert.ok(audit.vulnerabilities && audit.metadata?.vulnerabilities)
  const findings = Object.entries(audit.vulnerabilities)
  assert.equal(audit.metadata.vulnerabilities.total, findings.length, 'Audit count and findings disagree')
  if (findings.length === 0) {
    assert.equal(audit.metadata.vulnerabilities.total, 0)
    return []
  }
  assert.ok(today <= '2026-12-04', 'Baseline exception expired; review advisories and fixture isolation again')
  for (const key of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
    assert.equal(Object.keys(manifest[key] || {}).length, 0, 'Production graph must remain empty')
  }
  for (const [location, version] of Object.entries(baselines)) {
    const alias = location.slice('node_modules/'.length)
    assert.equal(manifest.devDependencies[alias], `npm:source-map-resolve@${version}`)
    assert.equal(lock.packages[location].name, 'source-map-resolve')
    assert.equal(lock.packages[location].version, version)
    assert.equal(lock.packages[location].dev, true)
  }
  assert.equal(lock.packages[decoder].version, '0.2.2')
  assert.equal(lock.packages[decoder].dev, true)
  assert.equal(lock.packages[decoder].resolved, 'https://registry.npmjs.org/decode-uri-component/-/decode-uri-component-0.2.2.tgz')
  assert.equal(lock.packages[decoder].integrity, 'sha512-FqUYQ+8o158GyGTrMFJms9qh3CqTKvAqgqsTnkLI8sKu0028orqBhxNMFkFen0zGyg6epACD32pjVk58ngIErQ==')
  const parents = []
  for (const [location, metadata] of Object.entries(lock.packages)) {
    for (const key of ['dependencies', 'optionalDependencies', 'peerDependencies', 'devDependencies']) {
      if (metadata[key]?.['decode-uri-component']) parents.push(location)
    }
  }
  assert.deepEqual(parents.sort(), Object.keys(baselines).sort(), 'Decoder may only be referenced by frozen comparison fixtures')
  assert.ok(Array.isArray(browserInputs) && browserInputs.length > 0, 'Measured browser inputs are required')
  const allowedNodes = [decoder, ...Object.keys(baselines)]
  for (const input of browserInputs) {
    assert.ok(!allowedNodes.some(location => input === location || input.startsWith(`${location}/`)), 'Historical fixtures must not enter browser bundles')
  }
  const accepted = new Set()
  for (const [name, finding] of findings) {
    assert.ok(['decode-uri-component', 'source-map-resolve'].includes(name), `Unexpected vulnerable package: ${name}`)
    assert.ok(Array.isArray(finding.nodes) && finding.nodes.length > 0)
    assert.ok(Array.isArray(finding.via) && finding.via.length > 0)
    for (const node of finding.nodes) {
      assert.ok(name === 'decode-uri-component' ? node === decoder : Object.hasOwn(baselines, node), `Unexpected vulnerable path: ${node}`)
      assert.equal(lock.packages[node].dev, true)
    }
    for (const via of finding.via) {
      if (name === 'source-map-resolve') {
        assert.equal(via, 'decode-uri-component', 'Only the reviewed decoder may cause the baseline metavulnerability')
        assert.ok(audit.vulnerabilities[via], 'Missing decoder advisory details')
      } else {
        assert.equal(typeof via, 'object')
        assert.equal(via.name, 'decode-uri-component')
        assert.equal(via.dependency, 'decode-uri-component')
        assert.ok(reviewed.has(via.url), `Unreviewed advisory: ${via.url}`)
        assert.equal(via.severity, reviewed.get(via.url).severity)
        assert.equal(via.range, reviewed.get(via.url).range)
        accepted.add(via.url)
      }
    }
  }
  return [...accepted].sort()
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const run = args => spawnSync(npm, args, { encoding: 'utf8' })
  const production = run(['audit', '--omit=dev', '--json'])
  assert.equal(production.status, 0, production.stdout + production.stderr)
  assert.equal(JSON.parse(production.stdout).metadata.vulnerabilities.total, 0)
  const result = run(['audit', '--json'])
  assert.equal(result.error, undefined)
  assert.equal(result.signal, null)
  assert.ok(result.status === 0 || result.status === 1, 'Unexpected npm audit status')
  const audit = JSON.parse(result.stdout)
  assert.equal(result.status, Object.keys(audit.vulnerabilities || {}).length ? 1 : 0, 'Audit status and findings disagree')
  const readJson = filename => JSON.parse(readFileSync(new URL(filename, root), 'utf8'))
  const exceptions = reviewBaselineAudit(audit, readJson('package.json'), readJson('package-lock.json'), readJson('build-evidence/browser-inputs.json'))
  console.log(JSON.stringify({ rawAuditVulnerabilities: audit.metadata.vulnerabilities, reviewedFixtureAdvisories: exceptions, expires: exceptions.length ? '2026-12-04' : null }, null, 2))
  if (exceptions.length) console.warn('Known vulnerable upstream comparison fixtures retained; production and measured browser bundles exclude them. Full development audit is not zero. See DEPENDENCY_DECISIONS.md.')
}
