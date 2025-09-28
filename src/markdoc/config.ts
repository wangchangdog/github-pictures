import type { Config } from '@markdoc/markdoc'

import type { MarkdocRenderComponent } from '@/markdoc/render-wrapper'

type MarkdocNodes = typeof import('@markdoc/markdoc').nodes
type MarkdocTags = NonNullable<Config['tags']>

export type ReactRenderComponent = MarkdocRenderComponent

export type ReactRenderTarget = string | ReactRenderComponent

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
