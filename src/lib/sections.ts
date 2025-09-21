import { type Node } from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'

interface HeadingNode extends Node {
  type: 'heading'
  attributes: {
    level: 1 | 2 | 3 | 4 | 5 | 6
    id?: string
    [key: string]: unknown
  }
}

type H2Node = HeadingNode & {
  attributes: {
    level: 2
  }
}

type H3Node = HeadingNode & {
  attributes: {
    level: 3
  }
}

function isHeadingNode(node: Node): node is HeadingNode {
  return (
    node.type === 'heading' &&
    [1, 2, 3, 4, 5, 6].includes(node.attributes.level) &&
    (typeof node.attributes.id === 'string' || node.attributes.id === undefined)
  )
}

function isH2Node(node: Node): node is H2Node {
  return isHeadingNode(node) && node.attributes.level === 2
}

function isH3Node(node: Node): node is H3Node {
  return isHeadingNode(node) && node.attributes.level === 3
}

function getNodeText(node: Node) {
  let text = ''
  for (const child of node.children ?? []) {
    if (child.type === 'text') {
      text += child.attributes.content
    }
    text += getNodeText(child)
  }
  return text
}

export type Subsection = H3Node['attributes'] & {
  id: string
  title: string
  children?: undefined
}

export type Section = H2Node['attributes'] & {
  id: string
  title: string
  children: Array<Subsection>
}

function createUniqueId(
  title: string,
  slugify: ReturnType<typeof slugifyWithCounter>,
  usedIds: Set<string>,
) {
  let base = slugify(title)
  if (!base) {
    base = slugify(`section-${usedIds.size + 1}`) || `section-${usedIds.size + 1}`
  }
  let candidate = base
  let suffix = 2
  while (!candidate || usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  usedIds.add(candidate)
  return candidate
}

export function collectSections(
  nodes: Array<Node>,
  slugify = slugifyWithCounter(),
  usedIds: Set<string> = new Set(),
) {
  const sections: Array<Section> = []

  for (const node of nodes) {
    if (isH2Node(node) || isH3Node(node)) {
      const title = getNodeText(node)
      if (title) {
        const id = createUniqueId(title, slugify, usedIds)
        if (isH3Node(node)) {
          const lastSection = sections.at(-1)
          if (!lastSection) {
            continue
          }
          lastSection.children.push({
            ...node.attributes,
            id,
            title,
          })
        } else {
          sections.push({ ...node.attributes, id, title, children: [] })
        }
      }
    }

    sections.push(...collectSections(node.children ?? [], slugify, usedIds))
  }

  return sections
}
