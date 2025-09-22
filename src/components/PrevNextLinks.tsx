'use client'

import cx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navigation } from '@/lib/navigation'

function ArrowIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="m9.182 13.423-1.17-1.16 3.505-3.505H3V7.065h8.517l-3.506-3.5L9.181 2.4l5.512 5.511-5.511 5.512Z" />
    </svg>
  )
}

function PageLink({
  title,
  href,
  dir = 'next',
  ...props
}: Omit<React.ComponentPropsWithoutRef<'div'>, 'dir' | 'title'> & {
  title: string
  href: string
  dir?: 'previous' | 'next'
}) {
  return (
    <div {...props}>
      <dt className="font-display text-sm font-medium text-[var(--fg)]">
        {dir === 'next' ? 'Next' : 'Previous'}
      </dt>
      <dd className="mt-1">
        <Link
          href={href}
          className={cx(
            'flex items-center gap-x-1 text-base font-semibold text-[var(--fg-muted)] transition hover:text-[var(--fg)]',
            dir === 'previous' && 'flex-row-reverse',
          )}
        >
          {title}
          <ArrowIcon
            className={cx(
              'h-4 w-4 flex-none fill-current',
              dir === 'previous' && '-scale-x-100',
            )}
          />
        </Link>
      </dd>
    </div>
  )
}

export function PrevNextLinks() {
  const pathname = usePathname()
  const allLinks = navigation.flatMap((section) => section.links)
  const linkIndex = allLinks.findIndex((link) => link.href === pathname)
  const previousPage = linkIndex > -1 ? allLinks.at(linkIndex - 1) ?? null : null
  const nextPage = linkIndex > -1 ? allLinks.at(linkIndex + 1) ?? null : null

  if (!nextPage && !previousPage) {
    return null
  }

  return (
    <dl className="mt-12 flex border-t border-[var(--border)] pt-6">
      {previousPage && <PageLink dir="previous" {...previousPage} />}
      {nextPage && <PageLink className="ml-auto text-right" {...nextPage} />}
    </dl>
  )
}
