var path         = require("path")
var test         = require("tape")
var common       = require("./common")
var u1           = common.u1
var u2           = common.u2
var u3           = common.u3
var read         = common.read
var identity     = common.identity
var asyncify     = common.asyncify

// This licensed upstream suite retains its structure and assertion count. The
// expected paths below encode the intentional issue #9 correction: preserving
// a Windows drive designator rather than resolving against the process drive.
var sourceMapResolve = require("../../")

path.sep = "\\"


function testResolveSourceMap(method, sync) {
  return function(t) {
    var wrap = (sync ? identity : asyncify)

    var codeUrl = "c:\\a\\b\\c\\foo.js"

    t.plan(3 * 2)

    if (sync) {
      method = asyncify(method)
    }

    var map = {}
    var readMap = wrap(read(JSON.stringify(map)))

    method(u1("foo.js.map"), codeUrl, readMap, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "foo.js.map",
        url:               "c:/a/b/c/foo.js.map",
        sourcesRelativeTo: "c:/a/b/c/foo.js.map",
        map:               map
      })
    })

    method(u2("/foo.js.map"), codeUrl, readMap, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "/foo.js.map",
        url:               "c:/foo.js.map",
        sourcesRelativeTo: "c:/foo.js.map",
        map:               map
      })
    })

    method(u3("../foo.js.map"), codeUrl, readMap, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "../foo.js.map",
        url:               "c:/a/b/foo.js.map",
        sourcesRelativeTo: "c:/a/b/foo.js.map",
        map:               map
      })
    })

  }
}

test(".resolveSourceMap",     testResolveSourceMap(sourceMapResolve.resolveSourceMap,    false))

test(".resolveSourceMapSync", testResolveSourceMap(sourceMapResolve.resolveSourceMapSync, true))


function testResolveSources(method, sync) {
  return function(t) {
    var wrap = (sync ? identity : asyncify)

    var mapUrl = "c:\\a\\b\\c\\foo.js.map"

    t.plan(1 * 3)

    if (sync) {
      method = asyncify(method)
    }

    var map = {
      sources: ["foo.js", "/foo.js", "../foo.js"]
    }

    method(map, mapUrl, wrap(identity), function(error, result) {
      t.error(error)
      t.deepEqual(result.sourcesResolved, ["c:/a/b/c/foo.js", "c:/foo.js", "c:/a/b/foo.js"])
      t.deepEqual(result.sourcesContent,  ["c:/a/b/c/foo.js", "c:/foo.js", "c:/a/b/foo.js"])
    })

  }
}

test(".resolveSources",     testResolveSources(sourceMapResolve.resolveSources,    false))

test(".resolveSourcesSync", testResolveSources(sourceMapResolve.resolveSourcesSync, true))


function testResolve(method, sync) {
  return function(t) {
    var wrap = (sync ? identity : asyncify)
    var wrapMap = function(mapFn, fn) {
      return wrap(function(url) {
        if (/\.map$/.test(url)) {
          return mapFn(url)
        }
        return fn(url)
      })
    }

    var codeUrl = "c:\\a\\b\\c\\foo.js"

    t.plan(3 * 2)

    if (sync) {
      method = asyncify(method)
    }

    var map = {
      sources: ["foo.js", "/foo.js", "../foo.js"]
    }
    var readMap = wrapMap(read(JSON.stringify(map)), identity)

    method(u1("foo.js.map"), codeUrl, readMap, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "foo.js.map",
        url:               "c:/a/b/c/foo.js.map",
        sourcesRelativeTo: "c:/a/b/c/foo.js.map",
        map:               map,
        sourcesResolved:   ["c:/a/b/c/foo.js", "c:/foo.js", "c:/a/b/foo.js"],
        sourcesContent:    ["c:/a/b/c/foo.js", "c:/foo.js", "c:/a/b/foo.js"]
      })
    })

    method(u2("/foo.js.map"), codeUrl, readMap, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "/foo.js.map",
        url:               "c:/foo.js.map",
        sourcesRelativeTo: "c:/foo.js.map",
        map:               map,
        sourcesResolved:   ["c:/foo.js", "c:/foo.js", "c:/foo.js"],
        sourcesContent:    ["c:/foo.js", "c:/foo.js", "c:/foo.js"]
      })
    })

    method(u3("../foo.js.map"), codeUrl, readMap, function(error, result) {
      t.error(error)
      t.deepEqual(result, {
        sourceMappingURL:  "../foo.js.map",
        url:               "c:/a/b/foo.js.map",
        sourcesRelativeTo: "c:/a/b/foo.js.map",
        map:               map,
        sourcesResolved:   ["c:/a/b/foo.js", "c:/foo.js", "c:/a/foo.js"],
        sourcesContent:    ["c:/a/b/foo.js", "c:/foo.js", "c:/a/foo.js"]
      })
    })

  }
}

test(".resolve",     testResolve(sourceMapResolve.resolve,    false))

test(".resolveSync", testResolve(sourceMapResolve.resolveSync, true))
