import { createElement, type ComponentType } from 'react'

type MarkdocProps = Record<string, unknown>

export type MarkdocRenderComponent = ComponentType<MarkdocProps>

export function createMarkdocRenderWrapper<Props extends object>(
  Component: ComponentType<Props>,
): MarkdocRenderComponent {
  const MarkdocComponent: MarkdocRenderComponent = (props) =>
    createElement<Props>(Component, props as Props)

  const name = Component.displayName ?? Component.name ?? 'Component'
  MarkdocComponent.displayName = `Markdoc(${name})`

  return MarkdocComponent
}
