import { nodes as defaultNodes, Tag } from '@markdoc/markdoc'
import { load as loadYaml } from 'js-yaml'

import { DocsLayout } from '@/components/DocsLayout'
import { Fence } from '@/components/Fence'
import { createHeadingSlugContext } from '@/lib/heading-slug'

const documentHeadingContextMap = new WeakMap()
const autoLinkStateMap = new WeakMap()

function getAutoLinkStack(config) {
  let stack = autoLinkStateMap.get(config)
  if (!stack) {
    stack = []
    autoLinkStateMap.set(config, stack)
  }
  return stack
}

function withAutoLinkDisabled(config, callback) {
  const stack = getAutoLinkStack(config)
  stack.push(false)
  try {
    return callback()
  } finally {
    stack.pop()
  }
}

function isAutoLinkEnabled(config) {
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
    transform(node, config) {
      documentHeadingContextMap.set(config, createHeadingSlugContext())
      autoLinkStateMap.set(config, [])

      return new Tag(
        this.render,
        {
          frontmatter: loadYaml(node.attributes.frontmatter),
          nodes: node.children,
        },
        node.transformChildren(config),
      )
    },
  },
  heading: {
    ...defaultNodes.heading,
    transform(node, config) {
      let context = documentHeadingContextMap.get(config)
      if (!context) {
        context = createHeadingSlugContext()
        documentHeadingContextMap.set(config, context)
      }
      const attributes = node.transformAttributes(config)
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
    transform(node, config) {
      if (typeof defaultNodes.code.transform !== 'function') {
        return node.transformChildren(config)
      }
      return withAutoLinkDisabled(config, () =>
        defaultNodes.code.transform.call(this, node, config),
      )
    },
  },
  link: {
    ...defaultNodes.link,
    transform(node, config) {
      const attributes = withExternalLinkAttributes(
        node.transformAttributes(config),
      )
      const children = node.transformChildren(config)

      return new Tag('a', attributes, children)
    },
  },
  text: {
    ...defaultNodes.text,
    transform(node, config) {
      const defaultTransform =
        typeof defaultNodes.text.transform === 'function'
          ? defaultNodes.text.transform.call(this, node, config)
          : node.attributes?.content ?? ''

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
    transform(node, config) {
      if (typeof defaultNodes.fence.transform !== 'function') {
        return node.transformChildren(config)
      }
      return withAutoLinkDisabled(config, () =>
        defaultNodes.fence.transform.call(this, node, config),
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
}

function getNodeText(node) {
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

function autoLinkText(text) {
  const parts = []
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

function createExternalLinkTag(href) {
  return new Tag(
    'a',
    withExternalLinkAttributes({ href }),
    [href],
  )
}

function withExternalLinkAttributes(attributes) {
  const href = attributes?.href

  if (!isExternalHref(href)) {
    return attributes
  }

  const relValues = new Set(
    typeof attributes.rel === 'string'
      ? attributes.rel.split(/\s+/).filter(Boolean)
      : [],
  )
  relValues.add('noreferrer')

  return {
    ...attributes,
    target: '_blank',
    rel: relValues.size > 0 ? [...relValues].join(' ') : undefined,
    referrerPolicy: 'no-referrer',
  }
}

function isExternalHref(href) {
  if (typeof href !== 'string') {
    return false
  }

  return /^https?:\/\//.test(href)
}

export default nodes
