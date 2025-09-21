import { type Node } from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { toRomaji } from 'wanakana'

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

const HEX_RADIX = 16
const MAX_CODEPOINTS = 6

const TRANSLATION_PATTERNS: Array<[RegExp, string]> = [
  [/トラブルシューティング/gi, 'troubleshooting'],
  [/追加実装/gi, 'advanced-features'],
  [/状態管理/gi, 'state-management'],
  [/api連携/gi, 'api-integration'],
  [/テスト/gi, 'testing'],
  [/デバッグ/gi, 'debugging'],
  [/まとめ/gi, 'summary'],
  [/ポケモン/gi, 'pokemon'],
  [/一覧画面/gi, 'list-screen'],
  [/詳細画面/gi, 'detail-screen'],
  [/レスポンシブデザイン/gi, 'responsive-design'],
  [/導入/gi, 'introduction'],
  [/設定/gi, 'configuration'],
  [/作成/gi, 'creation'],
  [/準備/gi, 'setup'],
  [/環境/gi, 'environment'],
  [/利用方法/gi, 'usage'],
  [/基本/gi, 'basics'],
  [/参考/gi, 'reference'],
  [/連携/gi, 'integration'],
  [/一覧/gi, 'list'],
  [/詳細/gi, 'detail'],
  [/追加/gi, 'extra'],
  [/実装/gi, 'implementation'],
]

const TITLE_SLUG_OVERRIDES = new Map([
  ['Reactポケモン図鑑アプリ開発カリキュラム', 'react-pokemon-zukan-curriculum'],
  ['はじめに', 'introduction'],
  ['開発環境の準備', 'environment-setup'],
  ['GitHubリポジトリの作成', 'github-repository'],
  ['Viteプロジェクトのセットアップ', 'vite-project-setup'],
  ['TypeScriptとReactの基本(説明のみ、ファイル追加は不要)', 'typescript-react-basics'],
  ['React Routerの導入', 'react-router-setup'],
  ['Tailwind CSSの設定とグローバルconfigなどの追加', 'tailwind-css-config'],
  ['PokeAPIの利用方法（更新）', 'pokeapi-usage'],
  ['Tanstack Queryの導入', 'tanstack-query'],
  ['ポケモン一覧画面の作成', 'pokemon-list-screen'],
  ['ポケモン詳細画面の作成', 'pokemon-detail-screen'],
  ['レスポンシブデザインの実装', 'responsive-design'],
  ['GitHub Pagesへのデプロイ (追加)', 'github-pages-deploy'],
  ['状態管理とAPI連携(ここは読むだけ)', 'state-management-api'],
  ['テストとデバッグの仕方(参考)', 'testing-and-debugging'],
  ['まとめ', 'summary'],
  ['追加実装(早く終わった人)', 'advanced-extras'],
  ['FAQ', 'faq'],
  ['ライセンス', 'license'],
  ['トラブルシューティング', 'troubleshooting'],
])

function translateToEnglish(text: string) {
  let result = text
  for (const [pattern, replacement] of TRANSLATION_PATTERNS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

function createUniqueId(
  title: string,
  slugify: ReturnType<typeof slugifyWithCounter>,
  usedIds: Set<string>,
) {
  const override = TITLE_SLUG_OVERRIDES.get(title.trim())
  if (override) {
    let candidate = slugify(override)
    if (!candidate) {
      candidate = override
    }
    if (!usedIds.has(candidate)) {
      usedIds.add(candidate)
      return candidate
    }
  }
  const translated = translateToEnglish(title)
  let base = slugify(translated)
  if (!base) {
    const romaji = toRomaji(title)
    base = slugify(romaji)
  }
  if (!base) {
    base = slugify(`section-${usedIds.size + 1}`) || `section-${usedIds.size + 1}`
  }
  if (!base) {
    const charCodes = [...title.trim()]
      .map((char) => char.codePointAt(0)?.toString(HEX_RADIX) ?? '')
      .filter(Boolean)
      .slice(0, MAX_CODEPOINTS)
      .join('-')
    base = charCodes
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
