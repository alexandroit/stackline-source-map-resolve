import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = fileURLToPath(new URL('../release-candidate/', import.meta.url))
await mkdir(output, { recursive: false })

function run (command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    ...options
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return result.stdout
}

const pack = JSON.parse(run('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', output]))[0]
const tarball = path.join(output, pack.filename)
const bytes = await readFile(tarball)
const hashes = {}
for (const algorithm of ['sha1', 'sha256', 'sha512']) {
  hashes[algorithm] = createHash(algorithm).update(bytes).digest('hex')
  await writeFile(path.join(output, `${algorithm.toUpperCase()}SUMS`), `${hashes[algorithm]}  ${pack.filename}\n`)
}

const sbom = run('npm', ['sbom', '--omit=dev', '--sbom-format', 'cyclonedx'])
JSON.parse(sbom)
await writeFile(path.join(output, 'sbom.cdx.json'), sbom)
await writeFile(path.join(output, 'inventory.json'), `${JSON.stringify(pack.files, null, 2)}\n`)
await writeFile(path.join(output, 'release-manifest.json'), `${JSON.stringify({
  fileCount: pack.entryCount,
  filename: pack.filename,
  hashes,
  integrity: pack.integrity,
  name: pack.name,
  packedSize: pack.size,
  unpackedSize: pack.unpackedSize,
  version: pack.version
}, null, 2)}\n`)

console.log(JSON.stringify({ tarball, hashes, integrity: pack.integrity }, null, 2))
