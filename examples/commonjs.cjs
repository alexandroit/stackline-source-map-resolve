const sourceMapResolve = require('@stackline/source-map-resolve')

const code = '//# sourceMappingURL=data:application/json,%7B%22version%22%3A3%2C%22sources%22%3A%5B%22input.ts%22%5D%2C%22sourcesContent%22%3A%5B%22export%20const%20value%20%3D%201%22%5D%2C%22mappings%22%3A%22%22%7D'
const result = sourceMapResolve.resolveSync(code, 'https://example.test/app.js', () => '')

console.log(result.sourcesResolved[0])
console.log(result.sourcesContent[0])
