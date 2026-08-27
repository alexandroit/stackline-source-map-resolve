import { resolveSourceMapSync } from '@stackline/source-map-resolve'

const code = '//# sourceMappingURL=data:application/json,%7B%22version%22%3A3%2C%22sources%22%3A%5B%5D%2C%22mappings%22%3A%22%22%7D'
const result = resolveSourceMapSync(code, 'https://example.test/app.js', () => '')

console.log(result.map)
