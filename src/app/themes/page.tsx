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
          <div className="mt-2 grid grid-cols-1 gap-2 text-[10px] text-[var(--fg-muted)] sm:grid-cols-1">
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded bg-[var(--primary)] ring-1 ring-[var(--border)]" />
              <span>Primary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded bg-[var(--secondary)] ring-1 ring-[var(--border)]" />
              <span>Secondary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded bg-[var(--accent)] ring-1 ring-[var(--border)]" />
              <span>Accent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded bg-[var(--accent-underline)] ring-1 ring-[var(--border)]" />
              <span>Underline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded bg-[var(--surface-muted)] ring-1 ring-[var(--border)]" />
              <span>Surface-muted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 rounded bg-[var(--surface)] ring-1 ring-[var(--border)]" />
              <span>Surface</span>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-medium text-secondary-700 ring-1 ring-secondary-200">
              Secondary badge
            </span>
            <button className="rounded-md bg-secondary-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]">
              Secondary action
            </button>
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
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        <SampleCard title="Ghost × Psychic" className="theme-ghost-psychic" />
        <SampleCard title="Fairy × Divine" className="theme-fairy-arcane" />
        <SampleCard title="Electric Trio" className="theme-electric-trio" />
        <SampleCard title="Digital / Colorful" className="theme-digital-porygon" />
        <SampleCard title="Dual Heroes" className="theme-hero-dual" />
      </div>
    </div>
  )
}
