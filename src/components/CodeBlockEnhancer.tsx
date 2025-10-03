'use client'

import { useEffect } from 'react'

import Prism from '@/lib/prism'

const LANG_PREFIX = 'language-'
const LANGUAGE_ALIAS: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
}

function getLanguageFromAttrs(el: Element | null): string | null {
  if (!el) return null
  const dataset = (el as HTMLElement).dataset
  return (
    el.getAttribute('language') ||
    dataset.language ||
    el.getAttribute('lang')
  )
}

function getLanguageFromClass(el: Element | null): string | null {
  if (!el) return null
  const hit = [...el.classList].find((c) => c.startsWith(LANG_PREFIX))
  return hit ? hit.slice(LANG_PREFIX.length) : null
}

function detectLanguage(pre: Element): string | null {
  const candidates = [
    getLanguageFromAttrs(pre),
    getLanguageFromClass(pre),
    getLanguageFromClass(pre.querySelector('code')),
    getLanguageFromAttrs(pre.querySelector('code')),
  ]

  for (const candidate of candidates) {
    if (!candidate) continue
    return candidate.trim().toLowerCase()
  }

  return null
}

function resolveLanguage(raw: string | null): {
  language: string
  label: string
} {
  if (!raw) {
    return { language: 'text', label: 'TEXT' }
  }

  const normalized = LANGUAGE_ALIAS[raw] ?? raw
  return { language: normalized, label: normalized.toUpperCase() }
}

export function CodeBlockEnhancer() {
  useEffect(() => {
    const preElements = document.querySelectorAll<HTMLPreElement>('.prose pre')

    for (const pre of preElements) {
      if (pre.dataset.enhanced === 'true') {
        continue
      }

      const code = pre.textContent ?? ''
      const wrapper = document.createElement('div')
      wrapper.className = 'group relative'

      const header = document.createElement('div')
      header.className =
        'absolute inset-x-0 top-0 flex items-center justify-between rounded-t-xl border-b border-slate-700/40 bg-slate-900/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 backdrop-blur-sm dark:border-slate-600/40 dark:bg-slate-800/80'

      const langSpan = document.createElement('span')
      langSpan.className = 'text-slate-400 dark:text-slate-300'

      const { language, label } = resolveLanguage(detectLanguage(pre))
      langSpan.textContent = label

      const button = document.createElement('button')
      button.type = 'button'
      button.className =
        'pointer-events-auto inline-flex items-center gap-1 rounded-md border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs font-medium text-slate-300 opacity-0 transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-slate-500/60 dark:bg-slate-700/70 dark:text-slate-100'
      button.setAttribute('aria-label', 'Copy code to clipboard')

      const iconSpan = document.createElement('span')
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', '0 0 24 24')
      svg.setAttribute('fill', 'none')
      svg.setAttribute('stroke-width', '1.5')
      svg.setAttribute('stroke', 'currentColor')
      svg.setAttribute('aria-hidden', 'true')
      svg.setAttribute('class', 'h-3.5 w-3.5')

      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path1.setAttribute(
        'd',
        'M9.75 8.25h7.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5Z',
      )
      path1.setAttribute('stroke-linecap', 'round')
      path1.setAttribute('stroke-linejoin', 'round')

      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path2.setAttribute(
        'd',
        'M6.75 15.75h-1.5a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v1.5',
      )
      path2.setAttribute('stroke-linecap', 'round')
      path2.setAttribute('stroke-linejoin', 'round')

      svg.append(path1, path2)
      iconSpan.append(svg)

      const textSpan = document.createElement('span')
      textSpan.textContent = 'Copy'

      button.append(iconSpan, textSpan)

      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code)
          textSpan.textContent = 'Copied'
          setTimeout(() => {
            textSpan.textContent = 'Copy'
          }, 2000)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to copy:', error)
        }
      })

      header.append(langSpan, button)

      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.append(header, pre)
      pre.classList.add('pt-12', `${LANG_PREFIX}${language}`)

      let codeEl = pre.querySelector('code')
      if (!codeEl) {
        codeEl = document.createElement('code')
        codeEl.textContent = code
        pre.textContent = ''
        pre.append(codeEl)
      }

      codeEl.classList.add(`${LANG_PREFIX}${language}`)
      Prism.highlightElement(codeEl)

      pre.dataset.enhanced = 'true'
    }
  }, [])

  return null
}
