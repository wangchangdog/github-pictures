'use client'

import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import cx from 'clsx'
import { useEffect, useState } from 'react'

type Palette = 'rotom' | 'rotom-clean' | 'lavender' | 'steel' | 'paldea' | 'kalos' | 'center'

const palettes: { name: string; value: Palette; swatch: string }[] = [
  { name: 'Rotom', value: 'rotom', swatch: 'bg-[--accent]' },
  { name: 'Rotom Clean', value: 'rotom-clean', swatch: 'bg-[--accent]' },
  { name: 'Lavender', value: 'lavender', swatch: 'bg-[--accent]' },
  { name: 'Steel × Ice', value: 'steel', swatch: 'bg-[--accent]' },
  { name: 'Paldea Uva', value: 'paldea', swatch: 'bg-[--accent]' },
  { name: 'Kalos Elegance', value: 'kalos', swatch: 'bg-[--accent]' },
  { name: 'Center Clean', value: 'center', swatch: 'bg-[--accent]' },
]

function applyPalette(p: Palette | null) {
  if (typeof document === 'undefined') {
    return
  }
  const el = document.documentElement
  el.classList.remove(
    'theme-rotom',
    'theme-rotom-clean',
    'theme-lavender',
    'theme-steel',
    'theme-paldea-uva',
    'theme-kalos-elegance',
    'theme-center-clean',
  )
  if (p) el.classList.add(`theme-${p}`)
}

export function PaletteSelector(
  props: React.ComponentPropsWithoutRef<typeof Listbox<'div'>>,
) {
  const [mounted, setMounted] = useState(false)
  const [palette, setPalette] = useState<Palette | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('palette') as Palette | null
      if (['rotom', 'rotom-clean', 'lavender', 'steel', 'paldea', 'kalos', 'center'].includes(saved ?? '')) {
        setPalette(saved)
        applyPalette(saved)
      } else {
        // Default to Steel × Ice when not set
        setPalette('steel')
        localStorage.setItem('palette', 'steel')
        applyPalette('steel')
      }
    } catch { /* noop */ }
  }, [])

  function onChange(p: string) {
    const v = p as Palette
    setPalette(v)
    try {
      localStorage.setItem('palette', v)
    } catch { /* noop */ }
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
        <span className="inline-block h-3 w-3 rounded-full bg-[var(--accent)] ring-1 ring-[var(--border)]" />
        <span className="hidden text-xs text-[var(--fg-muted)] md:block">
          {current}
        </span>
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
              <span className="inline-block h-4 w-4 rounded-md bg-[var(--accent)] ring-1 ring-[var(--border)]" />
              <span className="ml-3">{p.name}</span>
            </>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
