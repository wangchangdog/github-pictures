import Link from 'next/link'

import { Icon } from '@/components/Icon'

export function QuickLinks({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  )
}

export function QuickLink({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ComponentProps<typeof Icon>['icon']
}) {
  return (
    <div className="group relative rounded-xl border border-[var(--border)] transition hover:border-[var(--accent)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
      <div className="relative overflow-hidden rounded-xl p-6">
        <Icon icon={icon} className="h-8 w-8 text-[var(--accent)]" />
        <h2 className="mt-4 font-display text-base text-[var(--fg)]">
          <Link href={href}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          {description}
        </p>
      </div>
    </div>
  )
}
