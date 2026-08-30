import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  chmod,
  copyFile,
  cp,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile
} from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const destination = path.join(root, 'release-candidate')
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

function run (command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  })
}

async function normalizeTree (directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) await normalizeTree(target)
    else if (entry.isFile()) await chmod(target, 0o644)
  }
}

async function pack (source, output) {
  await mkdir(output)
  const raw = run(npm, [
    'pack', '--silent', '--json', '--ignore-scripts', '--pack-destination', output
  ], { cwd: source }).trim()
  const start = raw.lastIndexOf('\n[')
  const records = JSON.parse(start === -1 ? raw : raw.slice(start + 1))
  assert.equal(records.length, 1)
  assert.ok(records[0].files.every(({ mode }) => mode === 0o644),
    'every shipped regular file must have mode 0644')
  return records[0]
}

if (await stat(destination).then(() => true, () => false)) {
  throw new Error(`${destination} already exists; move the immutable prior candidate before creating a new one`)
}

run(npm, ['run', 'verify'], { stdio: 'inherit' })
const temporary = await mkdtemp(path.join(root, '.artifact-stage-'))
const source = path.join(temporary, 'source')
const firstOutput = path.join(temporary, 'pack-a')
const secondOutput = path.join(temporary, 'pack-b')
const finalOutput = path.join(temporary, 'release-candidate')

try {
  await mkdir(source)
  const trackedFiles = run('git', ['ls-files', '-z']).split('\0').filter(Boolean)
  for (const file of trackedFiles) {
    const target = path.join(source, file)
    await mkdir(path.dirname(target), { recursive: true })
    await copyFile(path.join(root, file), target)
  }
  await cp(path.join(root, 'dist'), path.join(source, 'dist'), { recursive: true })
  await normalizeTree(source)

  const first = await pack(source, firstOutput)
  const second = await pack(source, secondOutput)
  assert.equal(first.filename, second.filename)

  const firstArchive = path.join(firstOutput, first.filename)
  const secondArchive = path.join(secondOutput, second.filename)
  const firstBytes = await readFile(firstArchive)
  const secondBytes = await readFile(secondArchive)
  const hashes = Object.fromEntries(['sha1', 'sha256', 'sha512'].map((algorithm) => [
    algorithm,
    createHash(algorithm).update(firstBytes).digest('hex')
  ]))
  assert.equal(hashes.sha256, createHash('sha256').update(secondBytes).digest('hex'))

  await mkdir(finalOutput)
  await copyFile(firstArchive, path.join(finalOutput, first.filename))
  const manifest = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'))
  const sourceCommit = run('git', ['rev-parse', 'HEAD']).trim()
  const releaseManifest = {
    schema: 'stackline-release-artifact-v1',
    package: manifest.name,
    version: manifest.version,
    filename: first.filename,
    bytes: firstBytes.length,
    fileCount: first.entryCount,
    hashes,
    integrity: first.integrity,
    sourceCommit,
    reproducibleTwoPack: true
  }

  const sbom = JSON.parse(run(npm, ['sbom', '--omit=dev', '--sbom-format', 'cyclonedx']))
  await writeFile(path.join(finalOutput, 'release-manifest.json'), `${JSON.stringify(releaseManifest, null, 2)}\n`)
  await writeFile(path.join(finalOutput, 'inventory.json'), `${JSON.stringify(first.files, null, 2)}\n`)
  await writeFile(path.join(finalOutput, 'licenses.json'), `${JSON.stringify({
    package: { license: manifest.license, name: manifest.name, version: manifest.version },
    productionDependencies: [],
    vendoredAttribution: 'decode-uri-component, MIT, Sam Verschueren'
  }, null, 2)}\n`)
  await writeFile(path.join(finalOutput, 'RELEASE_NOTES.md'), [
    `# ${manifest.name} ${manifest.version}`,
    '',
    'Compatibility-first source-map resolution with a zero-dependency production graph.',
    '',
    'This release removes the stale atob and decode-uri-component production edges while preserving the seven-function CommonJS API, Node 12 support, ESM, browser bundles, TypeScript declarations, tolerant URI decoding, and UTF-8 base64 maps.',
    '',
    `Source commit: ${sourceCommit}`,
    `Artifact SHA-256: ${hashes.sha256}`,
    ''
  ].join('\n'))
  await writeFile(path.join(finalOutput, 'SHA1SUMS'), `${hashes.sha1}  ${first.filename}\n`)
  await writeFile(path.join(finalOutput, 'SHA256SUMS'), `${hashes.sha256}  ${first.filename}\n`)
  await writeFile(path.join(finalOutput, 'SHA512SUMS'), `${hashes.sha512}  ${first.filename}\n`)
  await writeFile(path.join(finalOutput, 'sbom.cdx.json'), `${JSON.stringify(sbom, null, 2)}\n`)

  await rename(finalOutput, destination)
  console.log(JSON.stringify(releaseManifest, null, 2))
} finally {
  await rm(temporary, { force: true, recursive: true })
}
