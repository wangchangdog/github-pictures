import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Markdoc from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import fastGlob from 'fast-glob'
import { createLoader } from 'simple-functional-loader'

const __filename = fileURLToPath(import.meta.url)
const slugify = slugifyWithCounter()
// eslint-disable-next-line import/no-named-as-default-member -- fast-glob is CommonJS
const globSync = (...parameters) => fastGlob.sync(...parameters)

function toString(node) {
  let str =
    node.type === 'text' && typeof node.attributes?.content === 'string'
      ? node.attributes.content
      : ''
  if ('children' in node) {
    for (const child of node.children) {
      str += toString(child)
    }
  }
  return str
}

function extractSections(node, sections, isRoot = true) {
  if (isRoot) {
    slugify.reset()
  }
  if (node.type === 'heading' || node.type === 'paragraph') {
    const content = toString(node).trim()
    if (node.type === 'heading' && node.attributes.level <= 2) {
      const hash = node.attributes?.id ?? slugify(content)
      sections.push([content, hash, []])
    } else {
      const lastSection = sections.at(-1)
      if (lastSection) {
        lastSection[2].push(content)
      }
    }
  } else if ('children' in node) {
    for (const child of node.children) {
      extractSections(child, sections, false)
    }
  }
}

export default function withSearch(nextConfig = {}) {
  const cache = new Map()

  return {
    ...nextConfig,
    webpack(config, options) {
      config.module.rules.push({
        test: __filename,
        use: [
          createLoader(function () {
            const pagesDir = path.resolve('./src/app')
            this.addContextDependency(pagesDir)

            const files = globSync('**/page.md', { cwd: pagesDir })
            const data = files.map((filePath) => {
              const pageUrl =
                filePath === 'page.md'
                  ? '/'
                  : `/${filePath.replace(/\/page\.md$/, '')}`
              const markdown = readFileSync(path.join(pagesDir, filePath), 'utf8')

              const cachedEntry = cache.get(filePath)
              if (cachedEntry?.[0] === markdown) {
                return { url: pageUrl, sections: cachedEntry[1] }
              }

              const ast = Markdoc.parse(markdown)
              const title =
                ast.attributes?.frontmatter?.match(/^title:\s*(.*?)\s*$/m)?.[1]
              const sections = [[title, null, []]]

              extractSections(ast, sections)
              cache.set(filePath, [markdown, sections])

              return { url: pageUrl, sections }
            })

            // When this file is imported within the application
            // the following module is loaded:
            return `
              import FlexSearch from 'flexsearch'

              let sectionIndex = new FlexSearch.Document({
                tokenize: 'full',
                document: {
                  id: 'url',
                  index: 'content',
                  store: ['title', 'pageTitle'],
                },
                context: {
                  resolution: 9,
                  depth: 2,
                  bidirectional: true
                }
              })

              let data = ${JSON.stringify(data)}

              for (let { url, sections } of data) {
                for (let [title, hash, content] of sections) {
                  sectionIndex.add({
                    url: url + (hash ? ('#' + hash) : ''),
                    title,
                    content: [title, ...content].join('\\n'),
                    pageTitle: hash ? sections[0][0] : undefined,
                  })
                }
              }

              export function search(query, options = {}) {
                let result = sectionIndex.search(query, {
                  ...options,
                  enrich: true,
                })
                if (result.length === 0) {
                  return []
                }
                return result[0].result.map((item) => ({
                  url: item.id,
                  title: item.doc.title,
                  pageTitle: item.doc.pageTitle,
                }))
              }
            `
          }),
        ],
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  }
}
