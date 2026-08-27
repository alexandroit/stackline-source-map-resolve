'use strict'

var atob = require('atob')
var urlLib = require('url')
var pathLib = require('path')
var decodeUriComponentLib = require('decode-uri-component')

function resolveUrl () {
  return Array.prototype.reduce.call(arguments, function (resolved, nextUrl) {
    return urlLib.resolve(resolved, nextUrl)
  })
}

function convertWindowsPath (aPath) {
  if (pathLib.sep !== '\\') return aPath

  // Keep the drive designator. Upstream removed it, causing a reader on C:\\ to
  // look for a D:\\ source map on the process drive instead. Forward slashes
  // remain accepted by Node's Windows filesystem APIs and URL resolution.
  return aPath.replace(/\\/g, '/')
}

function customDecodeUriComponent (string) {
  // decode-uri-component turns `+` into a space, which is not URL-path behavior.
  return decodeUriComponentLib(string.replace(/\+/g, '%2B'))
}

function callbackAsync (callback, error, result) {
  var defer = typeof setImmediate === 'function' ? setImmediate : setTimeout
  defer(function () { callback(error, result) }, 0)
}

function parseMapToJSON (string, data) {
  try {
    return JSON.parse(string.replace(/^\)\]\}'/, ''))
  } catch (error) {
    error.sourceMapData = data
    throw error
  }
}

function readSync (read, url, data) {
  var readUrl = customDecodeUriComponent(url)
  try {
    return String(read(readUrl))
  } catch (error) {
    error.sourceMapData = data
    throw error
  }
}

var innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/

var sourceMappingURLRegex = RegExp(
  '(?:' +
    '/\\*' +
    '(?:\\s*\r?\n(?://)?)?' +
    '(?:' + innerRegex.source + ')' +
    '\\s*' +
    '\\*/' +
    '|' +
    '//(?:' + innerRegex.source + ')' +
  ')' +
  '\\s*'
)

function getSourceMappingUrl (code) {
  var match = code.match(sourceMappingURLRegex)
  return match ? match[1] || match[2] || '' : null
}

function resolveSourceMap (code, codeUrl, read, callback) {
  var mapData
  try {
    mapData = resolveSourceMapHelper(code, codeUrl)
  } catch (error) {
    return callbackAsync(callback, error)
  }
  if (!mapData || mapData.map) {
    return callbackAsync(callback, null, mapData)
  }
  var readUrl = customDecodeUriComponent(mapData.url)
  read(readUrl, function (error, result) {
    if (error) {
      error.sourceMapData = mapData
      return callback(error)
    }
    mapData.map = String(result)
    try {
      mapData.map = parseMapToJSON(mapData.map, mapData)
    } catch (error) {
      return callback(error)
    }
    callback(null, mapData)
  })
}

function resolveSourceMapSync (code, codeUrl, read) {
  var mapData = resolveSourceMapHelper(code, codeUrl)
  if (!mapData || mapData.map) return mapData
  mapData.map = readSync(read, mapData.url, mapData)
  mapData.map = parseMapToJSON(mapData.map, mapData)
  return mapData
}

var dataUriRegex = /^data:([^,;]*)(;[^,;]*)*(?:,(.*))?$/
var jsonMimeTypeRegex = /^(?:application|text)\/json$/
var jsonCharacterEncoding = 'utf-8'

function base64ToBuf (base64) {
  var binary = atob(base64)
  var array = new Uint8Array(binary.length)
  for (var index = 0; index < binary.length; index++) {
    array[index] = binary.charCodeAt(index)
  }
  return array
}

function decodeBase64String (base64) {
  if (typeof TextDecoder === 'undefined' || typeof Uint8Array === 'undefined') {
    return atob(base64)
  }
  var decoder = new TextDecoder(jsonCharacterEncoding, { fatal: true })
  return decoder.decode(base64ToBuf(base64))
}

function resolveSourceMapHelper (code, codeUrl) {
  codeUrl = convertWindowsPath(codeUrl)

  var url = getSourceMappingUrl(code)
  if (!url) return null

  var dataUri = url.match(dataUriRegex)
  if (dataUri) {
    var mimeType = dataUri[1] || 'text/plain'
    var lastParameter = dataUri[2] || ''
    var encoded = dataUri[3] || ''
    var data = {
      sourceMappingURL: url,
      url: null,
      sourcesRelativeTo: codeUrl,
      map: encoded
    }
    if (!jsonMimeTypeRegex.test(mimeType)) {
      var error = new Error('Unuseful data uri mime type: ' + mimeType)
      error.sourceMapData = data
      throw error
    }
    try {
      data.map = parseMapToJSON(
        lastParameter === ';base64'
          ? decodeBase64String(encoded)
          : decodeURIComponent(encoded),
        data
      )
    } catch (error) {
      error.sourceMapData = data
      throw error
    }
    return data
  }

  var mapUrl = resolveUrl(codeUrl, url)
  return {
    sourceMappingURL: url,
    url: mapUrl,
    sourcesRelativeTo: mapUrl,
    map: null
  }
}

function resolveSources (map, mapUrl, read, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  var pending = map.sources ? map.sources.length : 0
  var result = {
    sourcesResolved: [],
    sourcesContent: []
  }

  if (pending === 0) {
    callbackAsync(callback, null, result)
    return
  }

  var done = function () {
    pending--
    if (pending === 0) callback(null, result)
  }

  resolveSourcesHelper(map, mapUrl, options, function (fullUrl, sourceContent, index) {
    result.sourcesResolved[index] = fullUrl
    if (typeof sourceContent === 'string') {
      result.sourcesContent[index] = sourceContent
      callbackAsync(done, null)
    } else {
      var readUrl = customDecodeUriComponent(fullUrl)
      read(readUrl, function (error, source) {
        result.sourcesContent[index] = error ? error : String(source)
        done()
      })
    }
  })
}

function resolveSourcesSync (map, mapUrl, read, options) {
  var result = {
    sourcesResolved: [],
    sourcesContent: []
  }

  if (!map.sources || map.sources.length === 0) return result

  resolveSourcesHelper(map, mapUrl, options, function (fullUrl, sourceContent, index) {
    result.sourcesResolved[index] = fullUrl
    if (read !== null) {
      if (typeof sourceContent === 'string') {
        result.sourcesContent[index] = sourceContent
      } else {
        var readUrl = customDecodeUriComponent(fullUrl)
        try {
          result.sourcesContent[index] = String(read(readUrl))
        } catch (error) {
          result.sourcesContent[index] = error
        }
      }
    }
  })

  return result
}

var endingSlash = /\/?$/

function resolveSourcesHelper (map, mapUrl, options, fn) {
  options = options || {}
  mapUrl = convertWindowsPath(mapUrl)
  var fullUrl
  var sourceContent
  var sourceRoot
  for (var index = 0, length = map.sources.length; index < length; index++) {
    sourceRoot = null
    if (typeof options.sourceRoot === 'string') {
      sourceRoot = options.sourceRoot
    } else if (typeof map.sourceRoot === 'string' && options.sourceRoot !== false) {
      sourceRoot = map.sourceRoot
    }
    if (sourceRoot === null || sourceRoot === '') {
      fullUrl = resolveUrl(mapUrl, map.sources[index])
    } else {
      fullUrl = resolveUrl(
        mapUrl,
        sourceRoot.replace(endingSlash, '/'),
        map.sources[index]
      )
    }
    sourceContent = (map.sourcesContent || [])[index]
    fn(fullUrl, sourceContent, index)
  }
}

function resolve (code, codeUrl, read, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  if (code === null) {
    var mapUrl = codeUrl
    var data = {
      sourceMappingURL: null,
      url: mapUrl,
      sourcesRelativeTo: mapUrl,
      map: null
    }
    var readUrl = customDecodeUriComponent(mapUrl)
    read(readUrl, function (error, result) {
      if (error) {
        error.sourceMapData = data
        return callback(error)
      }
      data.map = String(result)
      try {
        data.map = parseMapToJSON(data.map, data)
      } catch (error) {
        return callback(error)
      }
      resolveAllSources(data)
    })
  } else {
    resolveSourceMap(code, codeUrl, read, function (error, mapData) {
      if (error) return callback(error)
      if (!mapData) return callback(null, null)
      resolveAllSources(mapData)
    })
  }

  function resolveAllSources (mapData) {
    resolveSources(mapData.map, mapData.sourcesRelativeTo, read, options, function (error, result) {
      if (error) return callback(error)
      mapData.sourcesResolved = result.sourcesResolved
      mapData.sourcesContent = result.sourcesContent
      callback(null, mapData)
    })
  }
}

function resolveSync (code, codeUrl, read, options) {
  var mapData
  if (code === null) {
    var mapUrl = codeUrl
    mapData = {
      sourceMappingURL: null,
      url: mapUrl,
      sourcesRelativeTo: mapUrl,
      map: null
    }
    mapData.map = readSync(read, mapUrl, mapData)
    mapData.map = parseMapToJSON(mapData.map, mapData)
  } else {
    mapData = resolveSourceMapSync(code, codeUrl, read)
    if (!mapData) return null
  }
  var result = resolveSourcesSync(mapData.map, mapData.sourcesRelativeTo, read, options)
  mapData.sourcesResolved = result.sourcesResolved
  mapData.sourcesContent = result.sourcesContent
  return mapData
}

module.exports = {
  resolveSourceMap: resolveSourceMap,
  resolveSourceMapSync: resolveSourceMapSync,
  resolveSources: resolveSources,
  resolveSourcesSync: resolveSourcesSync,
  resolve: resolve,
  resolveSync: resolveSync,
  parseMapToJSON: parseMapToJSON
}
