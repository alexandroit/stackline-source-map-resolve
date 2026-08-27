import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const source = new URL('../docs-site/', import.meta.url)
const output = new URL('../site-dist/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))

await mkdir(output, { recursive: true })

const staticFiles = [
  'analytics.js',
  'app.js',
  'index.html',
  'llms.txt',
  'robots.txt',
  'sitemap.xml',
  'styles.css'
]

for (const file of staticFiles) {
  const contents = await readFile(new URL(file, source), 'utf8')
  await writeFile(
    new URL(file, output),
    contents.split('{{PACKAGE_VERSION}}').join(manifest.version),
    'utf8'
  )
}

for (const file of [
  'CHANGELOG.md',
  'COMPATIBILITY_CONTRACT.md',
  'LICENSE',
  'MIGRATION.md',
  'NOTICE',
  'README.md',
  'SECURITY.md',
  'THIRD_PARTY_LICENSES.md'
]) {
  await writeFile(new URL(file, output), await readFile(new URL(file, root)))
}

const browserArtifact = await readFile(new URL('dist/source-map-resolve.browser.mjs', root))
await writeFile(new URL('source-map-resolve-browser.js', output), browserArtifact)
await writeFile(new URL('package-meta.json', output), `${JSON.stringify({
  browserArtifactSha256: createHash('sha256').update(browserArtifact).digest('hex'),
  name: manifest.name,
  node: manifest.engines.node,
  primaryBaseline: 'source-map-resolve@0.6.0',
  secondaryBaseline: 'source-map-resolve@0.5.3',
  version: manifest.version
}, null, 2)}\n`)

console.log(`Built documentation for ${manifest.name}@${manifest.version}.`)
