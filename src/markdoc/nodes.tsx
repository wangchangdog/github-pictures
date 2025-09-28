import type { Node as MarkdocNode, RenderableTreeNodes } from '@markdoc/markdoc'
import { nodes as defaultNodes, Tag } from '@markdoc/markdoc'
import { load as loadYaml } from 'js-yaml'

import { DocsLayout } from '@/components/DocsLayout'
import { Fence } from '@/components/Fence'
import { mergeRel } from '@/lib/external-link-attributes'
import { createHeadingSlugContext } from '@/lib/heading-slug'
import type {
  ReactMarkdocConfig,
  ReactNodes,
  ReactRenderTarget,
} from '@/markdoc/config'
import { createMarkdocRenderWrapper } from '@/markdoc/render-wrapper'

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
  ReactMarkdocConfig,
  HeadingSlugContext
>()
const autoLinkStateMap = new WeakMap<ReactMarkdocConfig, AutoLinkState>()

function getAutoLinkStack(config: ReactMarkdocConfig): AutoLinkState {
  let stack = autoLinkStateMap.get(config)
  if (!stack) {
    stack = []
    autoLinkStateMap.set(config, stack)
  }
  return stack
}

function withAutoLinkDisabled<T>(
  config: ReactMarkdocConfig,
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

function isAutoLinkEnabled(config: ReactMarkdocConfig): boolean {
  const stack = getAutoLinkStack(config)
  if (stack.length === 0) {
    return true
  }
  return stack.at(-1) !== false
}

function createRenderTag(
  render: ReactRenderTarget | undefined,
  attributes: TagAttributes,
  children: RenderableTreeNodes,
) {
  return new Tag(
    render as unknown as ConstructorParameters<typeof Tag>[0],
    attributes,
    Array.isArray(children) ? children : [children],
  )
}

type DocumentNode = NonNullable<ReactNodes['document']>
type HeadingNode = NonNullable<ReactNodes['heading']>
type CodeNode = NonNullable<ReactNodes['code']>
type LinkNode = NonNullable<ReactNodes['link']>
type TextNode = NonNullable<ReactNodes['text']>
type FenceNode = NonNullable<ReactNodes['fence']>

const DocsLayoutRender = createMarkdocRenderWrapper(DocsLayout)
const FenceRender = createMarkdocRenderWrapper(Fence)

const baseNodes: ReactNodes = defaultNodes

const nodes = {
  ...baseNodes,
  document: {
    ...baseNodes.document,
    render: DocsLayoutRender,
    transform(
      this: DocumentNode,
      node: MarkdocNode,
      config: ReactMarkdocConfig,
    ) {
      documentHeadingContextMap.set(config, createHeadingSlugContext())
      autoLinkStateMap.set(config, [])

      const children = node.transformChildren(config)

      return createRenderTag(
        this.render,
        {
          frontmatter: loadYaml(
            typeof node.attributes.frontmatter === 'string'
              ? node.attributes.frontmatter
              : '',
          ),
          nodes: node.children,
        },
        children,
      )
    },
  },
  heading: {
    ...baseNodes.heading,
    transform(this: HeadingNode, node: MarkdocNode, config: ReactMarkdocConfig) {
      let context = documentHeadingContextMap.get(config)
      if (!context) {
        context = createHeadingSlugContext()
        documentHeadingContextMap.set(config, context)
      }
      const attributes: Record<string, unknown> & { id?: string } =
        node.transformAttributes(config)
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
    ...baseNodes.th,
    attributes: {
      ...baseNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  code: {
    ...baseNodes.code,
    transform(
      this: CodeNode,
      node: MarkdocNode,
      config: ReactMarkdocConfig,
    ) {
      const codeTransform = defaultNodes.code.transform
      if (typeof codeTransform !== 'function') {
        return node.transformChildren(config)
      }
      return withAutoLinkDisabled(config, () =>
        codeTransform.call(this, node, config),
      )
    },
  },
  link: {
    ...baseNodes.link,
    transform(this: LinkNode, node: MarkdocNode, config: ReactMarkdocConfig) {
      const linkAttributes: LinkAttributes = node.transformAttributes(config)
      const attributes = withExternalLinkAttributes(linkAttributes)
      const children = node.transformChildren(config)

      return new Tag('a', attributes, children)
    },
  },
  text: {
    ...baseNodes.text,
    transform(
      this: TextNode,
      node: MarkdocNode,
      config: ReactMarkdocConfig,
    ) {
      const textTransform = defaultNodes.text.transform
      let defaultTransform: RenderableTreeNodes

      if (typeof textTransform === 'function') {
        const result = textTransform.call(this, node, config)
        if (result instanceof Promise) {
          return result
        }
        defaultTransform = result
      } else if (typeof node.attributes?.content === 'string') {
        defaultTransform = node.attributes.content
      } else {
        defaultTransform = ''
      }

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
    ...baseNodes.fence,
    render: FenceRender,
    transform(
      this: FenceNode,
      node: MarkdocNode,
      config: ReactMarkdocConfig,
    ) {
      const fenceTransform = defaultNodes.fence.transform
      if (typeof fenceTransform !== 'function') {
        return node.transformChildren(config)
      }
      return withAutoLinkDisabled(config, () =>
        fenceTransform.call(this, node, config),
      )
    },
    attributes: baseNodes.fence?.attributes
      ? {
        ...baseNodes.fence.attributes,
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
} satisfies ReactNodes

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
  if (!attributes) {
    return attributes
  }

  const { href } = attributes

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
