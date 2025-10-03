'use client'

import { useEffect } from 'react'


export function CodeBlockEnhancer() {
  useEffect(() => {
    // すべてのpreタグを取得
    const preElements = document.querySelectorAll('.prose pre')

    preElements.forEach((pre) => {
      // すでに拡張されている場合はスキップ
      if (pre.parentElement?.classList.contains('group')) {
        return
      }

      // コードの内容を取得
      const code = pre.textContent || ''

      // ラッパーdivを作成
      const wrapper = document.createElement('div')
      wrapper.className = 'group relative'

      // ヘッダーを作成
      const header = document.createElement('div')
      header.className = 'absolute inset-x-0 top-0 flex items-center justify-between rounded-t-xl border-b border-slate-700/40 bg-slate-900/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 backdrop-blur-sm dark:border-slate-600/40 dark:bg-slate-800/80'

      // 言語ラベル
      const langSpan = document.createElement('span')
      langSpan.className = 'text-slate-400 dark:text-slate-300'
      const langClass = Array.from(pre.classList).find(cls => cls.startsWith('language-'))
      const language = langClass ? langClass.replace('language-', '').toUpperCase() : 'TEXT'
      langSpan.textContent = language

      // コピーボタン
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'pointer-events-auto inline-flex items-center gap-1 rounded-md border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs font-medium text-slate-300 opacity-0 transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-slate-500/60 dark:bg-slate-700/70 dark:text-slate-100'
      button.setAttribute('aria-label', 'Copy code to clipboard')

      const iconSpan = document.createElement('span')
      iconSpan.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-3.5 w-3.5"><path d="M9.75 8.25h7.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5h-7.5a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5Z" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6.75 15.75h-1.5a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

      const textSpan = document.createElement('span')
      textSpan.textContent = 'Copy'

      button.appendChild(iconSpan)
      button.appendChild(textSpan)

      // コピー機能
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code)
          textSpan.textContent = 'Copied'
          setTimeout(() => {
            textSpan.textContent = 'Copy'
          }, 2000)
        } catch (err) {
          console.error('Failed to copy:', err)
        }
      })

      header.appendChild(langSpan)
      header.appendChild(button)

      // DOM構造を再構築
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(header)
      wrapper.appendChild(pre)

      // preにpadding-topを追加
      pre.classList.add('pt-12')
    })
  }, [])

  return null
}
