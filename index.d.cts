export = sourceMapResolve

declare namespace sourceMapResolve {
  interface RawSourceMap {
    version?: number
    file?: string
    sourceRoot?: string
    sources?: string[]
    sourcesContent?: Array<string | null>
    names?: string[]
    mappings?: string
    [key: string]: unknown
  }
  interface SourceMapData<TMap extends RawSourceMap = RawSourceMap> {
    sourceMappingURL: string | null
    url: string | null
    sourcesRelativeTo: string
    map: TMap
    sourcesResolved?: string[]
    sourcesContent?: Array<string | Error>
  }
  interface ResolvedSources {
    sourcesResolved: string[]
    sourcesContent: Array<string | Error>
  }
  interface ResolveOptions { sourceRoot?: string | false }
  type AsyncRead = (url: string, callback: (error: Error | null, content?: unknown) => void) => void
  type SyncRead = (url: string) => unknown
  type ResultCallback<T> = (error: Error | null, result?: T | null) => void
  function resolveSourceMap<TMap extends RawSourceMap = RawSourceMap>(code: string, codeUrl: string, read: AsyncRead, callback: ResultCallback<SourceMapData<TMap>>): void
  function resolveSourceMapSync<TMap extends RawSourceMap = RawSourceMap>(code: string, codeUrl: string, read: SyncRead): SourceMapData<TMap> | null
  function resolveSources(map: RawSourceMap, mapUrl: string, read: AsyncRead, callback: ResultCallback<ResolvedSources>): void
  function resolveSources(map: RawSourceMap, mapUrl: string, read: AsyncRead, options: ResolveOptions, callback: ResultCallback<ResolvedSources>): void
  function resolveSourcesSync(map: RawSourceMap, mapUrl: string, read: SyncRead | null, options?: ResolveOptions): ResolvedSources
  function resolve<TMap extends RawSourceMap = RawSourceMap>(code: string | null, codeUrl: string, read: AsyncRead, callback: ResultCallback<SourceMapData<TMap>>): void
  function resolve<TMap extends RawSourceMap = RawSourceMap>(code: string | null, codeUrl: string, read: AsyncRead, options: ResolveOptions, callback: ResultCallback<SourceMapData<TMap>>): void
  function resolveSync<TMap extends RawSourceMap = RawSourceMap>(code: string | null, codeUrl: string, read: SyncRead, options?: ResolveOptions): SourceMapData<TMap> | null
  function parseMapToJSON<TMap extends RawSourceMap = RawSourceMap>(source: string, data?: unknown): TMap
}
