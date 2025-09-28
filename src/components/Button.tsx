import cx from 'clsx'
import Link from 'next/link'

const variantStyles = {
  primary:
    'rounded-full bg-[var(--accent)] py-2 px-4 text-sm font-semibold text-[var(--on-accent)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
  secondary:
    'rounded-full bg-[var(--interactive-bg)] py-2 px-4 text-sm font-medium text-[var(--fg)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  const combinedClassName = cx(variantStyles[variant], className)

  if ('href' in props && props.href !== undefined) {
    const { href, rel, target, ...rest } = props
    const isExternal = isExternalHref(href)
    const relValue = mergeRel(rel, isExternal ? 'noreferrer' : undefined)

    return (
      <Link
        className={combinedClassName}
        href={href}
        rel={relValue}
        target={isExternal ? '_blank' : target}
        {...rest}
        {...(isExternal ? { referrerPolicy: 'no-referrer' } : {})}
      />
    )
  }

  return <button className={combinedClassName} {...props} />
}

function isExternalHref(href: React.ComponentPropsWithoutRef<typeof Link>['href']) {
  if (typeof href === 'string') {
    return /^https?:\/\//.test(href)
  }

  return false
}

function mergeRel(
  existing: React.ComponentPropsWithoutRef<typeof Link>['rel'],
  required?: string,
) {
  const values = new Set(
    typeof existing === 'string' ? existing.split(/\s+/).filter(Boolean) : [],
  )

  if (required) {
    values.add(required)
  }

  return values.size > 0 ? [...values].join(' ') : undefined
}
