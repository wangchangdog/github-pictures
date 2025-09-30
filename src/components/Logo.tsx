import { useId } from 'react'

import { WORDMARK_PATH_D } from '@/components/wordmark-path'

function LogomarkPaths() {
  const clipPathRef = `${useId()}-pokeball-clip`.replaceAll(':', '-')

  return (
    <>
      <defs>
        <clipPath id={clipPathRef}>
          <circle cx="18" cy="18" r="16" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipPathRef})`}>
        <rect x="0" y="0" width="36" height="18" fill="#FF1C1C" />
        <path d="M34 18l-4.6 0-5.52-12.32 5.32-2.08L34 18Z" fill="#DF1818" />
        <rect x="0" y="18" width="36" height="18" fill="#FFFFFF" />
        <path d="M34 18l-4.6 0-6.36 13.44 5.96 2.24L34 18Z" fill="#DFDFDF" />
        <path d="M0 18h36" stroke="#101010" strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <circle cx="18" cy="18" r="16" fill="none" stroke="#101010" strokeWidth={2.4} />
      <circle cx="18" cy="18" r="6.2" fill="#FFFFFF" stroke="#101010" strokeWidth={2.4} />
      <circle cx="18" cy="18" r="3.4" fill="#DFDFDF" />
    </>
  )
}

export function Logomark(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" fill="none" {...props}>
      <LogomarkPaths />
    </svg>
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 227 36" fill="none" {...props}>
      <LogomarkPaths />
      <path d={WORDMARK_PATH_D} />
    </svg>
  )
}
