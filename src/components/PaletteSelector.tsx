'use client'

import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import cx from 'clsx'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type Palette =
  | 'ghost-psychic'
  | 'fairy-arcane'
  | 'electric-trio'
  | 'digital-porygon'
  | 'hero-dual'

const palettes: { name: string; value: Palette; swatch: string }[] = [
  { name: 'Ghost × Psychic', value: 'ghost-psychic', swatch: 'bg-[--accent]' },
  { name: 'Fairy × Divine', value: 'fairy-arcane', swatch: 'bg-[--accent]' },
  { name: 'Electric Trio', value: 'electric-trio', swatch: 'bg-[--accent]' },
  { name: 'Digital / Colorful', value: 'digital-porygon', swatch: 'bg-[--accent]' },
  { name: 'Dual Heroes', value: 'hero-dual', swatch: 'bg-[--accent]' },
]

function applyPalette(p: Palette | null) {
  if (typeof document === 'undefined') {
    return
  }
  const el = document.documentElement

  // Remove any existing theme-* class to avoid mixing
  const themeClasses: string[] = []
  for (const cls of el.classList) {
    if (cls.startsWith('theme-')) {
      themeClasses.push(cls)
    }
  }
  if (themeClasses.length > 0) {
    el.classList.remove(...themeClasses)
  }
  if (p) el.classList.add(`theme-${p}`)
}

export function PaletteSelector(
  props: React.ComponentPropsWithoutRef<typeof Listbox<'div'>>,
) {
  const [mounted, setMounted] = useState(false)
  const [palette, setPalette] = useState<Palette | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('palette') as Palette | null
      const allowed: Palette[] = [
        'ghost-psychic',
        'fairy-arcane',
        'electric-trio',
        'digital-porygon',
        'hero-dual',
      ]
      if (allowed.includes(saved as Palette)) {
        setPalette(saved)
        applyPalette(saved)
      } else {
        // Default to Ghost × Psychic when not set
        setPalette('ghost-psychic')
        localStorage.setItem('palette', 'ghost-psychic')
        applyPalette('ghost-psychic')
      }
    } catch {
      /* noop */
    }
  }, [])

  function onChange(p: string) {
    const v = p as Palette
    setPalette(v)
    try {
      localStorage.setItem('palette', v)
    } catch {
      /* noop */
    }
    applyPalette(v)
  }

  if (!mounted) return <div className="h-6 w-6" />

  const current = palettes.find((x) => x.value === palette)?.name ?? 'Palette'

  return (
    <Listbox as="div" value={palette ?? undefined} onChange={onChange} {...props}>
      <Label className="sr-only">Palette</Label>
      <ListboxButton
        className="flex h-6 items-center gap-2 rounded-lg px-2 shadow-md shadow-black/5 ring-1 ring-[var(--border)] bg-[var(--interactive-bg)]"
        aria-label="Palette"
      >
        <span className="inline-block h-3 w-3 rounded-full bg-[var(--primary)] ring-1 ring-[var(--border)]" />
        <span className="hidden text-xs text-[var(--fg-muted)] md:block">{current}</span>
      </ListboxButton>
      <ListboxOptions className="absolute top-full left-1/2 mt-3 w-40 -translate-x-1/2 space-y-1 rounded-xl bg-[var(--surface)] p-3 text-sm font-medium text-[var(--fg-muted)] shadow-md shadow-black/5 ring-1 ring-[var(--border)]">
        {palettes.map((p) => (
          <ListboxOption
            key={p.value}
            value={p.value}
            className={({ focus, selected }) =>
              cx(
                'flex cursor-pointer items-center rounded-[0.625rem] p-1 select-none',
                {
                  'text-[var(--primary)]': selected,
                  'text-[var(--fg)]': focus && !selected,
                  'text-[var(--fg-muted)]': !focus && !selected,
                  'bg-[var(--interactive-bg)]': focus,
                },
              )
            }
          >
            <>
              {/* 候補ごとにローカルにパレット変数を適用して、各テーマの色をプレビュー */}
              <span
                className={cx(
                  'inline-block h-4 w-4 rounded-md ring-1',
                  `theme-${p.value}`,
                  resolvedTheme === 'dark' && 'dark',
                  'bg-[var(--primary)] ring-[var(--border)]',
                )}
              />
              <span className="ml-3">{p.name}</span>
            </>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
