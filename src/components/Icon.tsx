import cx from 'clsx'
import { useId } from 'react'

import { InstallationIcon } from '@/components/icons/InstallationIcon'
import { LightbulbIcon } from '@/components/icons/LightbulbIcon'
import { PluginsIcon } from '@/components/icons/PluginsIcon'
import { PresetsIcon } from '@/components/icons/PresetsIcon'
import { ThemingIcon } from '@/components/icons/ThemingIcon'
import { WarningIcon } from '@/components/icons/WarningIcon'

const icons = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon,
}

const iconStyles = {
  blue: '[--icon-foreground:var(--color-slate-900)] [--icon-background:var(--color-white)]',
  amber:
    '[--icon-foreground:var(--color-amber-900)] [--icon-background:var(--color-amber-100)]',
}

export function Icon({
  icon,
  color = 'blue',
  className,
  ...props
}: {
  color?: keyof typeof iconStyles
  icon: keyof typeof icons
} & Omit<React.ComponentPropsWithoutRef<'svg'>, 'color'>) {
  const id = useId()
  const IconComponent = icons[icon]

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={cx(className, iconStyles[color])}
      {...props}
    >
      <IconComponent id={id} color={color} />
    </svg>
  )
}

export { DarkMode, Gradient, LightMode } from '@/components/IconPrimitives'
