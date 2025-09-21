import { slugifyWithCounter } from '@sindresorhus/slugify'
import { toRomaji } from 'wanakana'

/** @typedef {{ generateId: (title: string) => string }} HeadingSlugContext */

const HEX_RADIX = 16
const MAX_CODEPOINTS = 6

export const TRANSLATION_PATTERNS = [
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

export const TITLE_SLUG_OVERRIDES = new Map([
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

function translateToEnglish(text) {
  let result = text
  for (const [pattern, replacement] of TRANSLATION_PATTERNS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

function fallbackFromCharCodes(text) {
  return [...text.trim()]
    .map((char) => char.codePointAt(0)?.toString(HEX_RADIX) ?? '')
    .filter(Boolean)
    .slice(0, MAX_CODEPOINTS)
    .join('-')
}

/**
 * @returns {HeadingSlugContext}
 */
export function createHeadingSlugContext() {
  const slugify = slugifyWithCounter()
  const usedIds = new Set()

  function ensureUnique(base, sourceTitle) {
    let candidate = base
    let suffix = 2

    if (!candidate) {
      const charCodeFallback = fallbackFromCharCodes(sourceTitle)
      candidate = charCodeFallback || `section-${usedIds.size + 1}`
    }

    while (!candidate || usedIds.has(candidate)) {
      const baseForSuffix = base || fallbackFromCharCodes(sourceTitle) || 'section'
      candidate = `${baseForSuffix}-${suffix}`
      suffix += 1
    }

    usedIds.add(candidate)
    return candidate
  }

  return {
    generateId(rawTitle) {
      const title = typeof rawTitle === 'string' ? rawTitle.trim() : ''

      if (!title) {
        return ensureUnique('', 'section')
      }

      const override = TITLE_SLUG_OVERRIDES.get(title)
      if (override) {
        const overrideSlug = slugify(override) || override
        return ensureUnique(overrideSlug, title)
      }

      const translated = translateToEnglish(title)
      let base = slugify(translated)

      if (!base) {
        const romaji = toRomaji(title)
        base = slugify(romaji)
      }

      if (!base) {
        base = slugify(`section-${usedIds.size + 1}`)
      }

      return ensureUnique(base, title)
    },
  }
}
