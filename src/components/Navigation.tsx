import cx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navigation } from '@/lib/navigation'

export function Navigation({
  className,
  onLinkClick,
}: {
  className?: string
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  const pathname = usePathname()

  return (
    <nav className={cx('text-base text-[var(--fg-muted)] lg:text-sm', className)}>
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-[var(--fg)]">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l-2 border-[var(--border)] lg:mt-4 lg:space-y-4"
            >
              {section.links.map((link) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className={cx(
                      'block w-full pl-3.5 text-[var(--fg-muted)] transition before:pointer-events-none before:absolute before:top-1/2 before:-left-1 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-[var(--border-muted)] hover:text-[var(--fg)] before:transition',
                      link.href === pathname
                        ? 'font-semibold text-[var(--primary)] before:bg-[var(--accent)] before:opacity-100'
                        : 'before:opacity-0 hover:before:opacity-100',
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
