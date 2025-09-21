export function LightMode({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'g'>) {
  return <g className={['dark:hidden', className].filter(Boolean).join(' ')} {...props} />
}

export function DarkMode({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'g'>) {
  return <g className={['hidden dark:inline', className].filter(Boolean).join(' ')} {...props} />
}

const gradients = {
  blue: [
    { stopColor: '#0EA5E9' },
    { stopColor: '#22D3EE', offset: '.527' },
    { stopColor: '#818CF8', offset: 1 },
  ],
  amber: [
    { stopColor: '#FDE68A', offset: '.08' },
    { stopColor: '#F59E0B', offset: '.837' },
  ],
} as const

export function Gradient({
  color = 'blue',
  ...props
}: {
  color?: keyof typeof gradients
} & Omit<React.ComponentPropsWithoutRef<'radialGradient'>, 'color'>) {
  return (
    <radialGradient
      cx={0}
      cy={0}
      r={1}
      gradientUnits="userSpaceOnUse"
      {...props}
    >
      {gradients[color].map((stop, stopIndex) => (
        <stop key={stopIndex} {...stop} />
      ))}
    </radialGradient>
  )
}
