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

  return props.href === undefined ? (
    <button className={combinedClassName} {...props} />
  ) : (
    <Link className={combinedClassName} {...props} />
  )
}
