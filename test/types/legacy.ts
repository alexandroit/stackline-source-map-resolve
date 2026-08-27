import sourceMapResolve = require('../../')

const map: sourceMapResolve.RawSourceMap = {
  version: 3,
  sources: ['input.ts'],
  mappings: ''
}
const syncRead: sourceMapResolve.SyncRead = (_url: string) => JSON.stringify(map)
const result = sourceMapResolve.resolveSync(null, 'https://example.test/app.js.map', syncRead)
if (result) {
  const first: string | Error | undefined = result.sourcesContent && result.sourcesContent[0]
  void first
}
const parsed: sourceMapResolve.RawSourceMap = sourceMapResolve.parseMapToJSON('{}')
void parsed
