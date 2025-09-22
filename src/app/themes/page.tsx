import { Prose } from '@/components/Prose'

function SampleCard({ title, className }: { title: string; className: string }) {
  return (
    <div className={className}>
      <div className="rounded-xl border border-black/5 bg-[var(--surface)] p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
        <h3 className="font-display text-xl text-[var(--fg)]">{title}</h3>
        <Prose className="mt-3">
          <p>
            これはテーマのプレビューです。リンクの色やアンダーライン、フォーカスリング、背景とのコントラストを確認できます。{' '}
            <a href="#">サンプルリンク</a> をホバーしてみてください。
          </p>
          <p>
            <button
              className="mt-2 rounded-md bg-[var(--interactive-bg)] px-3 py-1.5 text-sm text-[var(--fg)] ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] dark:ring-white/10"
            >
              フォーカスリングを確認
            </button>
          </p>
          <pre className="mt-4 rounded-lg bg-slate-900 p-4 text-xs text-slate-300 dark:bg-slate-800/60">
            <code>const theme = &apos;prototype&apos;</code>
          </pre>
        </Prose>
      </div>
    </div>
  )
}

export default function ThemesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-tight text-[var(--fg)]">テーマ プロトタイプ</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Rotom / Lavender / Steel に加えて Paldea / Kalos / Center も比較できます。
      </p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SampleCard title="Rotom Cyan" className="theme-rotom" />
        <SampleCard title="Rotom Dex" className="theme-rotom-dex" />
        <SampleCard title="Rotom Wash" className="theme-rotom-wash" />
        <SampleCard title="Rotom Clean" className="theme-rotom-clean" />
        <SampleCard title="Lavender Town" className="theme-lavender" />
        <SampleCard title="Steel × Ice" className="theme-steel" />
        <SampleCard title="Paldea Uva" className="theme-paldea-uva" />
        <SampleCard title="Kalos Elegance" className="theme-kalos-elegance" />
        <SampleCard title="Center Clean" className="theme-center-clean" />
      </div>
    </div>
  )
}
