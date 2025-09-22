'use client'

import cx from 'clsx'
import { Highlight } from 'prism-react-renderer'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { CopyIcon } from '@/components/icons/CopyIcon'

export function Fence({
  children,
  language,
}: {
  children: string
  language?: string
}) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const code = children.trimEnd()
  const highlightLanguage = language ?? 'text'
  const languageLabel = highlightLanguage.toUpperCase()

  const handleCopy = useCallback(async () => {
    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
      resetTimer.current = null
    }

    async function writeToClipboard(text: string) {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return
      }

      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.append(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

    try {
      await writeToClipboard(code)
      setCopied(true)
    } catch {
      setCopied(false)
      return
    }

    resetTimer.current = setTimeout(() => {
      setCopied(false)
      resetTimer.current = null
    }, 2000)
  }, [code])

  useEffect(
    () => () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }
    },
    [],
  )

  return (
    <div className="group relative">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between rounded-t-xl border-b border-slate-700/40 bg-slate-900/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 backdrop-blur-sm dark:border-slate-600/40 dark:bg-slate-800/80">
        <span className="text-slate-400 dark:text-slate-300">{languageLabel}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="pointer-events-auto inline-flex items-center gap-1 rounded-md border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-xs font-medium text-slate-300 opacity-0 transition focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-slate-500/60 dark:bg-slate-700/70 dark:text-slate-100"
          aria-live="polite"
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
        >
          <CopyIcon className="h-3.5 w-3.5" />
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <Highlight code={code} language={highlightLanguage} theme={{ plain: {}, styles: [] }}>
        {({ className, style, tokens, getTokenProps }) => (
          <pre className={cx(className, 'pt-12')} style={style}>
            <code>
              {tokens.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {line
                    .filter((token) => !token.empty)
                    .map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  {'\n'}
                </Fragment>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
