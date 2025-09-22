'use client'

import cx from 'clsx'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { type Section, type Subsection } from '@/lib/sections'

export function TableOfContents({
  tableOfContents,
}: {
  tableOfContents: Array<Section>
}) {
  const [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)

  const getHeadings = useCallback(
    (tableOfContents: Array<Section>) =>
      tableOfContents
        .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
        .map((id) => {
          const escapedId = typeof CSS === 'undefined' ? id : CSS.escape(id)
          const el = document.querySelector<HTMLElement>(`#${escapedId}`)
          if (!el) {
            return null
          }

          const style = window.getComputedStyle(el)
          const scrollMt = parseFloat(style.scrollMarginTop)

          const top = window.scrollY + el.getBoundingClientRect().top - scrollMt
          return { id, top }
        })
        .filter((x): x is { id: string; top: number } => x !== null),
    [],
  )

  useEffect(() => {
    if (tableOfContents.length === 0) return
    const headings = getHeadings(tableOfContents)
    function onScroll() {
      const top = window.scrollY
      let current = headings[0].id
      for (const heading of headings) {
        if (top >= heading.top - 10) {
          current = heading.id
        } else {
          break
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [getHeadings, tableOfContents])

  function isActive(section: Section | Subsection): boolean {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.some((child) => isActive(child))
  }

  return (
    <div className="hidden xl:sticky xl:top-19 xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
      <nav aria-labelledby="on-this-page-title" className="w-56">
        {tableOfContents.length > 0 && (
          <>
            <h2
              id="on-this-page-title"
              className="font-display text-sm font-medium text-[var(--fg)]"
            >
              On this page
            </h2>
            <ol role="list" className="mt-4 space-y-3 text-sm">
              {tableOfContents.map((section) => (
                <li key={section.id}>
                  <h3>
                    <Link
                      href={`#${section.id}`}
                      className={cx(
                        'transition',
                        isActive(section)
                          ? 'text-[var(--primary)]'
                          : 'font-normal text-[var(--fg-muted)] hover:text-[var(--fg)]',
                      )}
                    >
                      {section.title}
                    </Link>
                  </h3>
                  {section.children.length > 0 && (
                    <ol
                      role="list"
                      className="mt-2 space-y-3 pl-5 text-[var(--fg-muted)]"
                    >
                      {section.children.map((subSection) => (
                        <li key={subSection.id}>
                          <Link
                            href={`#${subSection.id}`}
                            className={
                              isActive(subSection)
                                ? 'text-[var(--primary)]'
                                : 'transition hover:text-[var(--fg)]'
                            }
                          >
                            {subSection.title}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}
      </nav>
    </div>
  )
}
