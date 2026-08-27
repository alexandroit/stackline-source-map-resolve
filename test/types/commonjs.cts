import sourceMapResolve = require('../../')

const read: sourceMapResolve.AsyncRead = (_url, callback) => callback(null, '{}')
sourceMapResolve.resolveSourceMap('//# sourceMappingURL=app.js.map', 'https://example.test/app.js', read, (error, result) => {
  if (error) throw error
  const url: string | null | undefined = result && result.url
  void url
})
