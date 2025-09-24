import { type Metadata } from 'next'
import Script from 'next/script'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Reactポケモン図鑑 Docs',
    default: 'Reactポケモン図鑑 Docs',
  },
  description:
    'TypeScript・Vite・React Router・Tailwind CSS・TanStack Queryで学ぶ、ポケモン図鑑アプリのハンズオンカリキュラム。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full bg-[var(--bg)] text-[var(--fg)]">
        <Script id="palette-init" strategy="beforeInteractive">
          {`
            try {
              const key = 'palette';
              const saved = localStorage.getItem(key);
              const el = document.documentElement;
              const allowed = ['rotom','rotom-clean','lavender','steel','paldea','kalos','center'];
              let applied = '';
              if (saved && allowed.includes(saved)) {
                applied = saved;
              } else {
                applied = 'steel';
                localStorage.setItem(key, applied);
              }
              el.classList.add('theme-' + applied);
            } catch (_) {}
          `}
        </Script>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  )
}
