import { type SearchOptions } from 'flexsearch'

declare module '@/markdoc/search.mjs' {
  export type Result = {
    url: string
    title: string
    pageTitle?: string
  }

  export function search(query: string, options?: SearchOptions): Array<Result>
}

declare module 'js-yaml' {
  export interface LoadOptions {
    filename?: string
    schema?: unknown
    onWarning?(error: unknown): void
    json?: boolean
  }

  export function load(source: string, options?: LoadOptions): unknown
}

// Allow importing global CSS files (side-effect imports)
declare module '*.css'
