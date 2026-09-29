import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
assert.equal(manifest.dependencies, undefined)
assert.equal(manifest.optionalDependencies, undefined)
assert.equal(manifest.peerDependencies, undefined)

const thirdParty = await readFile(new URL('THIRD_PARTY_LICENSES.md', root), 'utf8')
assert.match(thirdParty, /Copyright \(c\) 2017, Sam Verschueren/)
assert.match(thirdParty, /Permission is hereby granted, free of charge/)
assert(thirdParty.includes(`Version ${manifest.version} has no production, optional, or peer dependencies`))

console.log('Vendored license attribution and zero-dependency production graph verified.')
