#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import slugify from '@sindresorhus/slugify'
import fg from 'fast-glob'
import { dump as dumpYaml } from 'js-yaml'
import { toRomaji } from 'wanakana'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

const DEFAULT_OUTPUT = path.join(projectRoot, 'src/app/docs')
const RAW_ROOT = path.join(projectRoot, 'raw_markdowns')

function parseArgs(argv) {
  const args = { outDir: DEFAULT_OUTPUT, clean: false, dryRun: false }
  const tokens = [...argv]
  while (tokens.length > 0) {
    const token = tokens.shift()
    if (token === '--out') {
      const next = tokens.shift()
      if (!next) throw new Error('Missing value for --out')
      args.outDir = path.resolve(projectRoot, next)
    } else if (token === '--clean') {
      args.clean = true
    } else if (token === '--dry-run') {
      args.dryRun = true
    } else {
      throw new Error(`Unknown argument: ${token}`)
    }
  }
  return args
}

function normalizeNewlines(value) {
  return value.replace(/\r\n?/g, '\n')
}

const MERGE_WITH_PREVIOUS = new Set(['見本リポジトリ', '見本のサイト'])

const HEX_RADIX = 16
const MAX_CODEPOINTS = 6

const TRANSLATION_PATTERNS = [
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
  [/導入/gi, 'introduction'],
  [/基本/gi, 'basics'],
  [/参考/gi, 'reference'],
  [/連携/gi, 'integration'],
  [/一覧/gi, 'list'],
  [/詳細/gi, 'detail'],
  [/追加/gi, 'extra'],
  [/実装/gi, 'implementation'],
  [/部署/gi, 'section'],
]

function translateToEnglish(text) {
  let result = text
  for (const [pattern, replacement] of TRANSLATION_PATTERNS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

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

function splitSections(rawMarkdown) {
  const lines = normalizeNewlines(rawMarkdown).split('\n')
  const sections = []
  let prelude = []
  let current = null
  let inFence = false
  let fenceMarker = ''

  const startNewSection = (titleLine, lineIndex) => {
    const title = titleLine.replace(/^##\s*/, '').trim()
    if (!title) return
    const section = {
      title,
      headingLine: titleLine,
      startLine: lineIndex,
      lines: [titleLine],
    }
    sections.push(section)
    current = section
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const fenceMatch = line.match(/^```+/)
    if (fenceMatch) {
      const marker = fenceMatch[0]
      if (!inFence) {
        inFence = true
        fenceMarker = marker
      } else if (marker === fenceMarker) {
        inFence = false
        fenceMarker = ''
      }
    }

    if (!inFence && line.startsWith('## ')) {
      const title = line.replace(/^##\s*/, '').trim()
      if (sections.length > 0 && MERGE_WITH_PREVIOUS.has(title) && current) {
        current.lines.push(line)
      } else {
        startNewSection(line, index)
      }
      continue
    }

    if (current) {
      current.lines.push(line)
    } else {
      prelude.push(line)
    }
  }

  if (sections.length === 0) {
    return prelude.length ? [{ title: 'index', headingLine: null, startLine: 0, lines: prelude }] : []
  }

  if (prelude.some((line) => line.trim().length > 0)) {
    const trimmedPrelude = trimPrelude(prelude)
    if (trimmedPrelude.length > 0) {
      sections[0].lines = [...trimmedPrelude, ...sections[0].lines]
    }
  }

  return sections.map((section) => ({
    title: section.title,
    lines: section.lines.join('\n'),
  }))
}

function trimPrelude(lines) {
  const sanitized = []
  let skipToc = false
  for (const line of lines) {
    if (line.startsWith('# ')) {
      continue
    }
    if (line.trim() === '- 目次') {
      skipToc = true
      continue
    }
    if (skipToc) {
      if (line.trim().length === 0) {
        skipToc = false
      }
      continue
    }
    sanitized.push(line)
  }
  while (sanitized.length > 0 && sanitized[0].trim().length === 0) {
    sanitized.shift()
  }
  while (sanitized.length > 0 && sanitized.at(-1).trim().length === 0) {
    sanitized.pop()
  }
  return sanitized
}

function summarizeParagraph(text) {
  if (!text) return ''
  const plain = text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.slice(0, 150)
}

function extractDescription(sectionContent) {
  const lines = normalizeNewlines(sectionContent).split('\n')
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line.trim()) continue
    if (/^#{1,6}\s/.test(line)) continue
    if (line.startsWith('---')) continue
    if (line.startsWith('Tags:')) continue
    if (line.startsWith('- ')) continue
    if (line.startsWith('```')) {
      // skip code block
      for (i += 1; i < lines.length && !lines[i].startsWith('```'); i += 1);
      continue
    }
    return summarizeParagraph(line)
  }
  return ''
}

function stripFirstHeading(sectionContent) {
  const lines = normalizeNewlines(sectionContent).split('\n')
  const result = []
  let skipped = false
  let index = 0
  while (index < lines.length) {
    const line = lines[index]
    if (!skipped && line.startsWith('## ')) {
      skipped = true
      index += 1
      continue
    }
    result.push(line)
    index += 1
  }
  return result.join('\n').replace(/^(\n)+/, '')
}

function buildSlugComponent(title) {
  const trimmed = title.trim()
  if (!trimmed) {
    return ''
  }
  const override = TITLE_SLUG_OVERRIDES.get(trimmed)
  if (override) {
    return override
  }
  const translated = translateToEnglish(trimmed)
  if (translated !== trimmed) {
    const englishSlug = slugify(translated, { decamelize: false, separator: '-' })
    if (englishSlug) {
      return englishSlug
    }
  }
  const primary = slugify(trimmed, { decamelize: false, separator: '-' })
  if (primary) return primary
  const romaji = toRomaji(trimmed)
  const romajiSlug = slugify(romaji, { decamelize: false, separator: '-' })
  if (romajiSlug) return romajiSlug
  const fallback = trimmed
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  if (fallback) {
    return fallback
  }
  const hexSlug = [...trimmed]
    .map((char) => char.codePointAt(0)?.toString(HEX_RADIX) ?? '')
    .filter(Boolean)
    .slice(0, MAX_CODEPOINTS)
    .join('-')
  return hexSlug
}

function generateSlug(title, index, existingSlugs) {
  const order = String(index + 1).padStart(2, '0')
  const stripped = title.replace(/^[\d\.\s]+/, '')
  const ascii = buildSlugComponent(stripped)
  const base = ascii.length > 0
    ? `section-${order}-${ascii}`
    : `section-${order}`
  let candidate = base
  let counter = 2
  while (existingSlugs.has(candidate)) {
    candidate = `${base}-${counter}`
    counter += 1
  }
  existingSlugs.add(candidate)
  return candidate
}

async function ensureEmptyDir(dir, clean) {
  await fs.mkdir(dir, { recursive: true })
  if (!clean) return
  const entries = await fs.readdir(dir)
  await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry)
      await fs.rm(full, { recursive: true, force: true })
    }),
  )
}

function findAssetReferences(sectionContent) {
  const refs = []
  let index = 0
  while (index < sectionContent.length) {
    const start = sectionContent.indexOf('![', index)
    if (start === -1) break
    const altStart = start + 2
    const altEnd = sectionContent.indexOf(']', altStart)
    if (altEnd === -1) break
    const parenStart = altEnd + 1
    if (sectionContent[parenStart] !== '(') {
      index = altEnd + 1
      continue
    }
    let pos = parenStart + 1
    let depth = 1
    while (pos < sectionContent.length && depth > 0) {
      const char = sectionContent[pos]
      if (char === '\\') {
        pos += 2
        continue
      }
      if (char === '(') {
        depth += 1
      } else if (char === ')') {
        depth -= 1
      }
      pos += 1
    }
    if (depth === 0) {
      const path = sectionContent.slice(parenStart + 1, pos - 1)
      const alt = sectionContent.slice(altStart, altEnd)
      const full = sectionContent.slice(start, pos)
      refs.push({ full, alt, path })
      index = pos
    } else {
      break
    }
  }
  return refs
}

function sanitizeAssetName(originalName, seen) {
  const { name, ext } = path.parse(originalName)
  const ascii = slugify(name, { decamelize: false, separator: '-' })
  let candidateBase = ascii.length > 0 ? ascii : 'asset'
  let counter = 1
  let candidate
  do {
    candidate = counter === 1 ? `${candidateBase}${ext.toLowerCase()}` : `${candidateBase}-${counter}${ext.toLowerCase()}`
    counter += 1
  } while (seen.has(candidate))
  seen.add(candidate)
  return candidate
}

async function migrate() {
  const args = parseArgs(process.argv.slice(2))
  const mdFiles = await fg('**/*.md', { cwd: RAW_ROOT, absolute: true })
  if (mdFiles.length === 0) {
    console.error('No markdown files found in raw_markdowns')
    process.exit(1)
  }

  await ensureEmptyDir(args.outDir, args.clean)

  const slugSet = new Set()
  const navEntries = []

  for (const mdFile of mdFiles) {
    const raw = await fs.readFile(mdFile, 'utf8')
    const sections = splitSections(raw)

    for (let index = 0; index < sections.length; index += 1) {
      const section = sections[index]
      const slug = generateSlug(section.title, index, slugSet)
      const sectionDir = path.join(args.outDir, slug)
      const assetsDir = path.join(sectionDir, 'assets')
      const description = extractDescription(section.lines)
      const bodyWithoutHeading = stripFirstHeading(section.lines)
      const assetRefs = findAssetReferences(bodyWithoutHeading)

      let transformedBody = bodyWithoutHeading
      const seenAssetNames = new Set()

      if (!args.dryRun && assetRefs.length > 0) {
        await fs.mkdir(assetsDir, { recursive: true })
      }

      for (const ref of assetRefs) {
        const decoded = decodeURIComponent(ref.path)
        const sourcePath = path.resolve(path.dirname(mdFile), decoded)
        let targetName
        if (!args.dryRun) {
          const stat = await fs.stat(sourcePath).catch(() => null)
          if (!stat || !stat.isFile()) {
            console.warn(`Warning: asset not found ${sourcePath}`)
            continue
          }
          targetName = sanitizeAssetName(path.basename(decoded), seenAssetNames)
          const targetPath = path.join(assetsDir, targetName)
          await fs.copyFile(sourcePath, targetPath)
        } else {
          targetName = sanitizeAssetName(path.basename(decoded), seenAssetNames)
        }
        const replacement = `![${ref.alt}](./assets/${targetName})`
        transformedBody = transformedBody.replace(ref.full, replacement)
      }

      const frontMatterObject = {
        title: section.title,
        nextjs: {
          metadata: {
            title: section.title,
            ...(description ? { description } : {}),
          },
        },
      }

      const frontMatter = `---\n${dumpYaml(frontMatterObject, { lineWidth: 0 })}---`

      if (!args.dryRun) {
        const body = transformedBody.trimStart()
        const content = `${frontMatter}\n${body ? `${body}\n` : ''}`
        await fs.mkdir(sectionDir, { recursive: true })
        await fs.writeFile(path.join(sectionDir, 'page.md'), content, 'utf8')
      }

      navEntries.push({ title: section.title, href: `/docs/${slug}` })
      console.log(`${args.dryRun ? '[dry-run] ' : ''}generated ${slug}`)
    }
  }

  if (args.dryRun) {
    console.log('Dry run complete. No files written.')
  }

  const navOutput = path.join(args.outDir, '_navigation.json')
  if (!args.dryRun) {
    await fs.writeFile(navOutput, JSON.stringify(navEntries, null, 2), 'utf8')
  }
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
