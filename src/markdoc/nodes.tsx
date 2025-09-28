import { nodes as defaultNodes, Tag } from '@markdoc/markdoc'
import type { Config as MarkdocConfig, Node as MarkdocNode } from '@markdoc/markdoc'
import { load as loadYaml } from 'js-yaml'

import { DocsLayout } from '@/components/DocsLayout'
import { Fence } from '@/components/Fence'
import { mergeRel } from '@/lib/external-link-attributes'
import { createHeadingSlugContext } from '@/lib/heading-slug'

type HeadingSlugContext = ReturnType<typeof createHeadingSlugContext>
type AutoLinkState = boolean[]
type TagAttributes = NonNullable<ConstructorParameters<typeof Tag>[1]>
type LinkAttributes = TagAttributes & {
  href?: string
  rel?: string
  target?: string
  referrerPolicy?: string
}

const documentHeadingContextMap = new WeakMap<
  MarkdocConfig,
  HeadingSlugContext
>()
const autoLinkStateMap = new WeakMap<MarkdocConfig, AutoLinkState>()

function getAutoLinkStack(config: MarkdocConfig): AutoLinkState {
  let stack = autoLinkStateMap.get(config)
  if (!stack) {
    stack = []
    autoLinkStateMap.set(config, stack)
  }
  return stack
}

function withAutoLinkDisabled<T>(
  config: MarkdocConfig,
  callback: () => T,
): T {
  const stack = getAutoLinkStack(config)
  stack.push(false)
  try {
    return callback()
  } finally {
    stack.pop()
  }
}

function isAutoLinkEnabled(config: MarkdocConfig): boolean {
  const stack = getAutoLinkStack(config)
  if (stack.length === 0) {
    return true
  }
  return stack.at(-1) !== false
}

const nodes = {
  document: {
    ...defaultNodes.document,
    render: DocsLayout,
    transform(
      this: (typeof defaultNodes.document & { render: typeof DocsLayout }) | {
        render: typeof DocsLayout
      },
      node: MarkdocNode,
      config: MarkdocConfig,
    ) {
      documentHeadingContextMap.set(config, createHeadingSlugContext())
      autoLinkStateMap.set(config, [])

      return new Tag(
        this.render,
        {
          frontmatter: loadYaml(
            typeof node.attributes.frontmatter === 'string'
              ? node.attributes.frontmatter
              : '',
          ),
          nodes: node.children,
        },
        node.transformChildren(config),
      )
    },
  },
  heading: {
    ...defaultNodes.heading,
    transform(node: MarkdocNode, config: MarkdocConfig) {
      let context = documentHeadingContextMap.get(config)
      if (!context) {
        context = createHeadingSlugContext()
        documentHeadingContextMap.set(config, context)
      }
      const attributes = node.transformAttributes(config) as Record<
        string,
        unknown
      > & { id?: string }
      const children = node.transformChildren(config)
      const text = getNodeText(node)
      const id = attributes.id ?? context.generateId(text)

      return new Tag(
        `h${node.attributes.level}`,
        { ...attributes, id },
        children,
      )
    },
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  code: {
    ...defaultNodes.code,
    transform(
      this: typeof defaultNodes.code,
      node: MarkdocNode,
      config: MarkdocConfig,
    ) {
      if (typeof defaultNodes.code.transform !== 'function') {
        return node.transformChildren(config)
      }
      return withAutoLinkDisabled(config, () =>
        defaultNodes.code.transform!.call(this, node, config),
      )
    },
  },
  link: {
    ...defaultNodes.link,
    transform(node: MarkdocNode, config: MarkdocConfig) {
      const attributes = withExternalLinkAttributes(
        node.transformAttributes(config) as LinkAttributes,
      )
      const children = node.transformChildren(config)

      return new Tag('a', attributes, children)
    },
  },
  text: {
    ...defaultNodes.text,
    transform(
      this: typeof defaultNodes.text,
      node: MarkdocNode,
      config: MarkdocConfig,
    ) {
      const defaultTransform =
        typeof defaultNodes.text.transform === 'function'
          ? defaultNodes.text.transform.call(this, node, config)
          : (node.attributes?.content as string | undefined) ?? ''

      if (!isAutoLinkEnabled(config)) {
        return defaultTransform
      }

      const content = defaultTransform

      if (typeof content !== 'string') {
        return content ?? ''
      }

      const parts = autoLinkText(content)

      if (parts.length === 1) {
        return parts[0]
      }

      return parts
    },
  },
  fence: {
    ...defaultNodes.fence,
    render: Fence,
    transform(
      this: typeof defaultNodes.fence,
      node: MarkdocNode,
      config: MarkdocConfig,
    ) {
      if (typeof defaultNodes.fence.transform !== 'function') {
        return node.transformChildren(config)
      }
      return withAutoLinkDisabled(config, () =>
        defaultNodes.fence.transform!.call(this, node, config),
      )
    },
    attributes: defaultNodes.fence.attributes
      ? {
          ...defaultNodes.fence.attributes,
          language: {
            type: String,
          },
        }
      : {
          language: {
            type: String,
          },
        },
  },
} as typeof defaultNodes

function getNodeText(node: MarkdocNode): string {
  let text = ''
  for (const child of node.children ?? []) {
    if (child.type === 'text' && typeof child.attributes?.content === 'string') {
      text += child.attributes.content
    }
    text += getNodeText(child)
  }
  return text
}

const TRAILING_PUNCTUATION = /[!"'),.:;?\]]+$/
const URL_PATTERN = /https?:\/\/[^\s<>[\\\]^`{|}]+/g

function autoLinkText(text: string): Array<string | Tag> {
  const parts: Array<string | Tag> = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const matchIndex = match.index ?? 0

    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex))
    }

    let url = match[0]
    const punctuationMatch = url.match(TRAILING_PUNCTUATION)
    let trailing = ''

    if (punctuationMatch) {
      trailing = punctuationMatch[0]
      url = url.slice(0, url.length - trailing.length)
    }

    if (url) {
      parts.push(createExternalLinkTag(url))
    }

    if (trailing) {
      parts.push(trailing)
    }

    lastIndex = matchIndex + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  if (parts.length === 0) {
    return [text]
  }

  return parts
}

function createExternalLinkTag(href: string): Tag {
  return new Tag('a', withExternalLinkAttributes({ href }), [href])
}

function withExternalLinkAttributes(
  attributes: LinkAttributes | undefined,
): LinkAttributes | undefined {
  const href = attributes?.href

  if (!isExternalHref(href)) {
    return attributes
  }

  return {
    ...attributes,
    target: '_blank',
    rel: mergeRel(attributes.rel, 'noreferrer'),
    referrerPolicy: 'no-referrer',
  }
}

function isExternalHref(href: unknown): href is string {
  if (typeof href !== 'string') {
    return false
  }

  return /^https?:\/\//.test(href)
}

export default nodes
