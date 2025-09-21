import { nodes as defaultNodes, Tag } from '@markdoc/markdoc'
import { load as loadYaml } from 'js-yaml'

import { DocsLayout } from '@/components/DocsLayout'
import { Fence } from '@/components/Fence'
import { createHeadingSlugContext } from '@/lib/heading-slug'

const documentHeadingContextMap = new WeakMap()

const nodes = {
  document: {
    ...defaultNodes.document,
    render: DocsLayout,
    transform(node, config) {
      documentHeadingContextMap.set(config, createHeadingSlugContext())

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
  fence: {
    render: Fence,
    attributes: {
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

export default nodes
