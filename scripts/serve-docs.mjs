import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../site-dist/', import.meta.url))
const port = Number(process.env.PORT || 4173)
const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8']
])

http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
    const file = path.resolve(root, relative)
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) throw new Error('invalid path')
    const details = await stat(file)
    if (!details.isFile()) throw new Error('not a file')
    response.writeHead(200, { 'content-type': types.get(path.extname(file)) || 'application/octet-stream' })
    createReadStream(file).pipe(response)
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    response.end('Not found\n')
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Documentation server listening at http://127.0.0.1:${port}/`)
})
