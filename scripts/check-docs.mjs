import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const output = new URL('../site-dist/', import.meta.url)
const required = [
  'CHANGELOG.md',
  'COMPATIBILITY_CONTRACT.md',
  'LICENSE',
  'MIGRATION.md',
  'NOTICE',
  'README.md',
  'SECURITY.md',
  'THIRD_PARTY_LICENSES.md',
  'analytics.js',
  'app.js',
  'index.html',
  'llms.txt',
  'package-meta.json',
  'robots.txt',
  'sitemap.xml',
  'source-map-resolve-browser.js',
  'styles.css'
]

const contents = new Map()
for (const file of required) contents.set(file, await readFile(new URL(file, output), 'utf8'))

const html = contents.get('index.html')
assert.match(html, /<link rel="canonical" href="https:\/\/alexandro\.net\/docs\/vanilla\/source-map-resolve\/">/)
assert.match(html, /@stackline\/source-map-resolve/)
assert.match(html, /source-map-resolve@0\.5\.3/)
assert.match(html, /source-map-resolve@0\.6\.0/)
assert.match(html, /Node\.js 12/)
assert.match(html, /language-aware parser/)
assert.doesNotMatch(html, /\{\{PACKAGE_VERSION\}\}/)
assert.doesNotMatch(Array.from(contents.values()).join('\n'), /localhost|UPSTREAM_AUDIT|PROJECT_MEMORY/)

const metadata = JSON.parse(contents.get('package-meta.json'))
assert.equal(metadata.name, '@stackline/source-map-resolve')
assert.equal(metadata.version, '1.0.2')
assert.equal(metadata.node, '>=12')
assert.equal(metadata.productionDependencies, 0)
assert.match(metadata.browserArtifactSha256, /^[a-f0-9]{64}$/)

const previousWindow = globalThis.window
globalThis.window = globalThis
const browserSource = contents.get('source-map-resolve-browser.js')
const browserModule = await import(`data:text/javascript;base64,${Buffer.from(browserSource).toString('base64')}`)
if (previousWindow === undefined) delete globalThis.window
else globalThis.window = previousWindow

const code = '//# sourceMappingURL=data:application/json,%7B%22version%22%3A3%2C%22sources%22%3A%5B%22input.ts%22%5D%2C%22mappings%22%3A%22%22%7D'
const result = browserModule.resolveSync(code, 'https://example.test/app.js', () => '')
assert.equal(result.sourcesResolved[0], 'https://example.test/input.ts')
assert.equal(browserModule.default.resolveSync, browserModule.resolveSync)

const workbenchMatch = html.match(/<textarea id="code"[^>]*>([\s\S]*?)<\/textarea>/)
assert.ok(workbenchMatch, 'the browser workbench needs a default source-map example')
const workbenchResult = browserModule.resolveSync(workbenchMatch[1], 'https://example.test/assets/app.js', () => '')
assert.equal(workbenchResult.sourcesResolved[0], 'https://example.test/assets/input.ts')
assert.equal(workbenchResult.sourcesContent[0], "console.log('hello')")

console.log('Static documentation, metadata, links, and deployed browser module checks passed.')
