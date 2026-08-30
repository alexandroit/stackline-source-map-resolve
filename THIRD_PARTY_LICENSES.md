# Third-Party Licenses

## source-map-resolve

- Upstream: <https://github.com/lydell/source-map-resolve>
- Compatibility baseline: `source-map-resolve@0.6.0`
- Additional shared-surface baseline: `source-map-resolve@0.5.3`
- Authors: Simon Lydell and ZHAO Jinxiang
- License: MIT

The complete upstream notice is retained in [LICENSE](./LICENSE). Licensed
upstream tests remain development evidence and are excluded from the npm
artifact.

## In-tree URI decoder

The tolerant percent-decoding implementation in `index.js` is adapted from
`decode-uri-component`, including the maintained 0.5.0 algorithm. Its complete
license notice follows:

```text
The MIT License (MIT)

Copyright (c) 2017, Sam Verschueren <sam.verschueren@gmail.com> (github.com/SamVerschueren)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Production dependency graph

Version 1.0.1 has no production, optional, or peer dependencies. Node.js uses
`Buffer.from` and browsers use their native `atob` implementation; no code from
the former `atob` package is installed or bundled.
