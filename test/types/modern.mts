import api, {
  parseMapToJSON,
  resolveSourceMapSync,
  type RawSourceMap,
  type SyncRead
} from '../../index.mjs'

const read: SyncRead = (_url) => '{}'
const result = resolveSourceMapSync('//# sourceMappingURL=app.js.map', 'https://example.test/app.js', read)
const map: RawSourceMap = parseMapToJSON('{"version":3}')
const same: typeof resolveSourceMapSync = api.resolveSourceMapSync
void result
void map
void same
