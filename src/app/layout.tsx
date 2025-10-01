import { type Metadata } from 'next'
import Script from 'next/script'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'

const metadataBase = new URL('https://react-pokemon-zukan-doc.vercel.app/')
const siteDescription =
  'React × TypeScript で作る「ポケモン図鑑」アプリのドキュメント。Vite・React Router・Tailwind CSS・TanStack Query まで、基礎から実装までをハンズオンで学べます。'
const ogImage = new URL('ogp/ogp.png', metadataBase)

export const metadata: Metadata = {
  metadataBase,
  title: {
    template: '%s - Reactポケモン図鑑 Docs',
    default: 'Reactポケモン図鑑 Docs',
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    title: 'Reactポケモン図鑑 Docs',
    siteName: 'Reactポケモン図鑑 Docs',
    description: siteDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Reactポケモン図鑑 Docs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reactポケモン図鑑 Docs',
    description: siteDescription,
    images: [ogImage.toString()],
  },
  icons: {
    icon: '/icons/pokeball-icon.svg',
  },
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
