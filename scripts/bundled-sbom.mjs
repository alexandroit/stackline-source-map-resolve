import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = new URL('../', import.meta.url)
const purl = (name, version) => `pkg:npm/${name.split('/').map(encodeURIComponent).join('/')}@${encodeURIComponent(version)}`

export async function createBundledSbom ({ sourceCommit, timestamp }) {
  assert.match(sourceCommit, /^[a-f0-9]{40}$/)
  const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'))
  const inputs = JSON.parse(await readFile(new URL('build-evidence/browser-inputs.json', root), 'utf8'))
  const installedPaths = Object.keys(lock.packages).filter(key => key.startsWith('node_modules/')).sort((a, b) => b.length - a.length)
  const contributing = new Set()
  for (const input of inputs) {
    if (!input.startsWith('node_modules/')) continue
    const installedPath = installedPaths.find(key => input.startsWith(`${key}/`))
    assert(installedPath, `Browser material missing from lock: ${input}`)
    contributing.add(installedPath)
  }
  for (const [key, expected] of [['path-browserify', '@stackline/path-browserify'], ['url', '@stackline/url']]) {
    assert(contributing.has(`node_modules/${key}`))
    assert.equal(lock.packages[`node_modules/${key}`].name, expected)
    assert.equal(lock.packages[`node_modules/${key}`].version, '1.0.0')
  }
  assert(!contributing.has('node_modules/setimmediate'), 'Test-only polyfill must not enter browser material')
  const components = [...contributing].sort().map(installedPath => {
    const metadata = lock.packages[installedPath]
    const name = metadata.name || installedPath.split('node_modules/').at(-1)
    assert(metadata.integrity && metadata.resolved && metadata.license)
    return {
      type: 'library', 'bom-ref': installedPath, name, version: metadata.version,
      purl: purl(name, metadata.version),
      licenses: [{ license: { id: metadata.license } }],
      externalReferences: [{ type: 'distribution', url: metadata.resolved }],
      properties: [
        { name: 'npm:integrity', value: metadata.integrity },
        { name: 'stackline:installed-alias-path', value: installedPath },
        { name: 'stackline:bundled-browser-material', value: 'true' },
        { name: 'stackline:installed-production', value: 'false' }
      ]
    }
  })
  const rootRef = `${manifest.name}@${manifest.version}`
  return {
    bomFormat: 'CycloneDX', specVersion: '1.5', version: 1,
    metadata: {
      timestamp,
      component: {
        type: 'library', 'bom-ref': rootRef, name: manifest.name, version: manifest.version,
        purl: purl(manifest.name, manifest.version), licenses: [{ license: { id: manifest.license } }],
        externalReferences: [{ type: 'vcs', url: `${manifest.repository.url.replace(/^git\+/, '')}#${sourceCommit}` }],
        properties: [{ name: 'stackline:source-commit', value: sourceCommit }]
      }
    },
    components,
    // Every component contributes code directly to the root browser artifacts.
    // This is the measured bundled graph, separate from the empty installed graph.
    dependencies: [{ ref: rootRef, dependsOn: components.map(component => component['bom-ref']) }]
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sbom = await createBundledSbom({ sourceCommit: '0'.repeat(40), timestamp: new Date().toISOString() })
  console.log(`Verified ${sbom.components.length} actual browser materials, including exact Stackline aliases; test-only setimmediate excluded.`)
}
