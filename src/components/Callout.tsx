import cx from 'clsx'

import { Icon } from '@/components/Icon'

const styles = {
  note: {
    container:
      'bg-[var(--interactive-bg)] ring-1 ring-[var(--border)]',
    title: 'text-[var(--primary)]',
    body: 'text-[var(--fg)] prose-a:text-[var(--primary)] prose-code:text-[var(--fg)]',
    icon: 'text-[var(--accent)]',
  },
  warning: {
    container:
      'bg-amber-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-amber-900 dark:text-amber-500',
    body: 'text-amber-800 [--tw-prose-underline:var(--color-amber-400)] [--tw-prose-background:var(--color-amber-50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:var(--color-amber-300)] dark:prose-code:text-slate-300',
    icon: 'text-amber-500',
  },
}

const icons = {
  note: (props: { className?: string }) => <Icon icon="lightbulb" {...props} />,
  warning: (props: { className?: string }) => (
    <Icon icon="warning" color="amber" {...props} />
  ),
}

export function Callout({
  title,
  children,
  type = 'note',
}: {
  title: string
  children: React.ReactNode
  type?: keyof typeof styles
}) {
  const IconComponent = icons[type]

  return (
    <div className={cx('my-8 flex rounded-3xl p-6', styles[type].container)}>
      <IconComponent className={cx('h-8 w-8 flex-none', styles[type].icon)} />
      <div className="ml-4 flex-auto">
        <p
          className={cx('not-prose font-display text-xl', styles[type].title)}
        >
          {title}
        </p>
        <div className={cx('prose mt-2.5', styles[type].body)}>
          {children}
        </div>
      </div>
    </div>
  )
}
