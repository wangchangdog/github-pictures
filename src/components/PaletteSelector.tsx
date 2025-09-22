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

type Palette = 'rotom' | 'lavender' | 'steel'

const palettes: { name: string; value: Palette; swatch: string }[] = [
  { name: 'Rotom', value: 'rotom', swatch: 'bg-[--accent]' },
  { name: 'Lavender', value: 'lavender', swatch: 'bg-[--accent]' },
  { name: 'Steel', value: 'steel', swatch: 'bg-[--accent]' },
]

function applyPalette(p: Palette | null) {
  const el = document.documentElement
  el.classList.remove('theme-rotom', 'theme-lavender', 'theme-steel')
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
      if (saved === 'rotom' || saved === 'lavender' || saved === 'steel') {
        setPalette(saved)
        applyPalette(saved)
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
        className="flex h-6 items-center gap-2 rounded-lg px-2 shadow-md ring-1 shadow-black/5 ring-black/5 dark:bg-slate-700 dark:ring-white/5 dark:ring-inset"
        aria-label="Palette"
      >
        <span className="inline-block h-3 w-3 rounded-full bg-[var(--accent)] ring-1 ring-black/10 dark:ring-white/10" />
        <span className="hidden text-xs text-slate-600 md:block dark:text-slate-300">
          {current}
        </span>
      </ListboxButton>
      <ListboxOptions className="absolute top-full left-1/2 mt-3 w-40 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md ring-1 shadow-black/5 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
        {palettes.map((p) => (
          <ListboxOption
            key={p.value}
            value={p.value}
            className={({ focus, selected }) =>
              cx(
                'flex cursor-pointer items-center rounded-[0.625rem] p-1 select-none',
                {
                  'text-[var(--primary)]': selected,
                  'text-slate-900 dark:text-white': focus && !selected,
                  'text-slate-700 dark:text-slate-400': !focus && !selected,
                  'bg-slate-100 dark:bg-slate-900/40': focus,
                },
              )
            }
          >
            <>
              <span className="inline-block h-4 w-4 rounded-md bg-[var(--accent)] ring-1 ring-slate-900/10 dark:ring-white/10" />
              <span className="ml-3">{p.name}</span>
            </>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
