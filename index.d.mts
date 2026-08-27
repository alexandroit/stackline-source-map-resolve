export interface RawSourceMap {
  version?: number
  file?: string
  sourceRoot?: string
  sources?: string[]
  sourcesContent?: Array<string | null>
  names?: string[]
  mappings?: string
  [key: string]: unknown
}

export interface SourceMapData<TMap extends RawSourceMap = RawSourceMap> {
  sourceMappingURL: string | null
  url: string | null
  sourcesRelativeTo: string
  map: TMap
  sourcesResolved?: string[]
  sourcesContent?: Array<string | Error>
}

export interface ResolvedSources {
  sourcesResolved: string[]
  sourcesContent: Array<string | Error>
}

export interface ResolveOptions { sourceRoot?: string | false }
export type AsyncRead = (url: string, callback: (error: Error | null, content?: unknown) => void) => void
export type SyncRead = (url: string) => unknown
export type ResultCallback<T> = (error: Error | null, result?: T | null) => void

export function resolveSourceMap<TMap extends RawSourceMap = RawSourceMap>(code: string, codeUrl: string, read: AsyncRead, callback: ResultCallback<SourceMapData<TMap>>): void
export function resolveSourceMapSync<TMap extends RawSourceMap = RawSourceMap>(code: string, codeUrl: string, read: SyncRead): SourceMapData<TMap> | null
export function resolveSources(map: RawSourceMap, mapUrl: string, read: AsyncRead, callback: ResultCallback<ResolvedSources>): void
export function resolveSources(map: RawSourceMap, mapUrl: string, read: AsyncRead, options: ResolveOptions, callback: ResultCallback<ResolvedSources>): void
export function resolveSourcesSync(map: RawSourceMap, mapUrl: string, read: SyncRead | null, options?: ResolveOptions): ResolvedSources
export function resolve<TMap extends RawSourceMap = RawSourceMap>(code: string | null, codeUrl: string, read: AsyncRead, callback: ResultCallback<SourceMapData<TMap>>): void
export function resolve<TMap extends RawSourceMap = RawSourceMap>(code: string | null, codeUrl: string, read: AsyncRead, options: ResolveOptions, callback: ResultCallback<SourceMapData<TMap>>): void
export function resolveSync<TMap extends RawSourceMap = RawSourceMap>(code: string | null, codeUrl: string, read: SyncRead, options?: ResolveOptions): SourceMapData<TMap> | null
export function parseMapToJSON<TMap extends RawSourceMap = RawSourceMap>(source: string, data?: unknown): TMap

declare const api: {
  resolveSourceMap: typeof resolveSourceMap
  resolveSourceMapSync: typeof resolveSourceMapSync
  resolveSources: typeof resolveSources
  resolveSourcesSync: typeof resolveSourcesSync
  resolve: typeof resolve
  resolveSync: typeof resolveSync
  parseMapToJSON: typeof parseMapToJSON
}

export default api
