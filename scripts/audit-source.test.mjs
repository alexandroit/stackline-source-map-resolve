import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { reviewBaselineAudit } from './audit-source.mjs'

const read = name => JSON.parse(readFileSync(new URL(`../${name}`, import.meta.url), 'utf8'))
const urls = ['GHSA-vcc3-ghjq-m6fr', 'GHSA-qr28-fpjm-wq7f']
function fixture () {
  return {
    audit: { metadata: { vulnerabilities: { total: 2, high: 2 } }, vulnerabilities: {
      'decode-uri-component': { nodes: ['node_modules/decode-uri-component'], via: urls.map((id, index) => ({ name: 'decode-uri-component', dependency: 'decode-uri-component', url: `https://github.com/advisories/${id}`, severity: index ? 'high' : 'moderate', range: index ? '<=0.5.0' : '<=0.4.2' })) },
      'source-map-resolve': { nodes: ['node_modules/source-map-resolve-baseline', 'node_modules/source-map-resolve-0-5-baseline'], via: ['decode-uri-component'] }
    } },
    manifest: read('package.json'), lock: read('package-lock.json'), inputs: ['index.js', 'node_modules/path-browserify/index.js']
  }
}
const review = data => reviewBaselineAudit(data.audit, data.manifest, data.lock, data.inputs, '2026-11-04')
test('permits only the two known advisories in exact development fixtures', () => { assert.equal(review(fixture()).length, 2) })
for (const [name, mutate] of [
  ['unknown advisory', d => { d.audit.vulnerabilities['decode-uri-component'].via[0].url = 'https://github.com/advisories/GHSA-unknown' }],
  ['unknown vulnerable package', d => { d.audit.vulnerabilities.other = { nodes: [], via: [] }; d.audit.metadata.vulnerabilities.total++ }],
  ['production dependency', d => { d.manifest.dependencies = { 'decode-uri-component': '0.2.2' } }],
  ['production decoder lock node', d => { d.lock.packages['node_modules/decode-uri-component'].dev = false }],
  ['different decoder version', d => { d.lock.packages['node_modules/decode-uri-component'].version = '0.5.0' }],
  ['different decoder integrity', d => { d.lock.packages['node_modules/decode-uri-component'].integrity = 'sha512-unknown' }],
  ['changed baseline', d => { d.manifest.devDependencies['source-map-resolve-baseline'] = 'npm:source-map-resolve@0.5.0' }],
  ['shared vulnerable decoder', d => { d.lock.packages['node_modules/other'] = { dev: true, dependencies: { 'decode-uri-component': '^0.2.0' } } }],
  ['baseline bundled into browser', d => { d.inputs.push('node_modules/source-map-resolve-baseline/index.js') }],
  ['decoder bundled into browser', d => { d.inputs.push('node_modules/decode-uri-component/index.js') }],
  ['missing browser evidence', d => { d.inputs = [] }],
  ['new vulnerable path', d => { d.audit.vulnerabilities['decode-uri-component'].nodes.push('node_modules/other/node_modules/decode-uri-component') }],
  ['unknown metavulnerability cause', d => { d.audit.vulnerabilities['source-map-resolve'].via.push('other') }],
  ['missing decoder cause', d => { delete d.audit.vulnerabilities['decode-uri-component']; d.audit.metadata.vulnerabilities.total-- }],
  ['audit error', d => { d.audit.error = { message: 'unavailable' } }],
  ['inconsistent audit totals', d => { d.audit.metadata.vulnerabilities.total = 0 }]
]) {
  test(`rejects ${name}`, () => { const data = fixture(); mutate(data); assert.throws(() => review(data)) })
}
test('expires and requires a new review', () => {
  const d = fixture()
  assert.throws(() => reviewBaselineAudit(d.audit, d.manifest, d.lock, d.inputs, '2026-12-05'), /expired/)
})
