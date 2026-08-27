import { rm } from 'node:fs/promises'

for (const path of ['../coverage', '../dist', '../site-dist']) {
  await rm(new URL(path, import.meta.url), { force: true, recursive: true })
}
