declare module 'js-yaml' {
  export interface LoadOptions {
    filename?: string
    schema?: unknown
    onWarning?(error: unknown): void
    json?: boolean
  }

  export function load(source: string, options?: LoadOptions): unknown
}
