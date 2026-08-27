import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const expected = new Map([
  ['atob', { version: '2.1.2', licenses: ['MIT', 'Apache-2.0'] }],
  ['decode-uri-component', { version: '0.2.2', licenses: ['MIT'] }]
])

for (const [name, contract] of expected) {
  const directory = new URL(`node_modules/${name}/`, root)
  const manifest = JSON.parse(await readFile(new URL('package.json', directory), 'utf8'))
  assert.equal(manifest.version, contract.version, `${name} version drifted`)
  const license = String(manifest.license || manifest.licenses || '')
  for (const identifier of contract.licenses) {
    assert.ok(license.includes(identifier), `${name} does not declare ${identifier}`)
  }
  const files = await readdir(directory)
  assert.ok(files.some((file) => /^licen[cs]e/i.test(file)), `${name} has no installed license file`)
}

const thirdParty = await readFile(new URL('THIRD_PARTY_LICENSES.md', root), 'utf8')
for (const name of expected.keys()) assert.ok(thirdParty.includes('`' + name + '`'))

console.log('Exact production dependency versions and installed license files verified.')
