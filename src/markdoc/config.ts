import type { Config } from '@markdoc/markdoc'
import type { ComponentType } from 'react'

type MarkdocNodes = typeof import('@markdoc/markdoc').nodes
type MarkdocTags = NonNullable<Config['tags']>

// Markdoc components come with diverse prop shapes, so allow arbitrary props.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReactRenderTarget = string | ComponentType<any>

type WithRender<TSchema, TRender> = TSchema extends {
  render?: infer Existing
}
  ? Omit<TSchema, 'render'> & { render?: Existing | TRender }
  : TSchema & { render?: TRender }

export type WithReactRender<TSchema> = WithRender<TSchema, ReactRenderTarget>

export type ReactifyNodes<TNodes extends Record<string, unknown>> = {
  [Key in keyof TNodes]: WithReactRender<TNodes[Key]>
}

export type ReactifyTags<TTags extends Record<string, unknown>> = {
  [Key in keyof TTags]: WithReactRender<TTags[Key]>
}

export type ReactNodes = ReactifyNodes<MarkdocNodes>
export type ReactTags = ReactifyTags<MarkdocTags>

export type ReactMarkdocConfig = Config
