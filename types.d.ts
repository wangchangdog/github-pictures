import { type SearchOptions } from 'flexsearch'

declare module '@/markdoc/search.mjs' {
  export type Result = {
    url: string
    title: string
    pageTitle?: string
  }

  export function search(query: string, options?: SearchOptions): Array<Result>
}

// Allow importing global CSS files (side-effect imports)
declare module '*.css'
declare module '@/styles/tailwind.css'
