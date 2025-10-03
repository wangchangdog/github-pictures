import type { PrismTheme } from 'prism-react-renderer'

export const prismTheme: PrismTheme = {
  plain: {
    backgroundColor: 'transparent',
    color: 'var(--color-slate-50)',
  },
  styles: [
    {
      types: ['comment', 'operator', 'combinator'],
      style: {
        color: 'var(--color-slate-400)',
      },
    },
    {
      types: ['punctuation', 'attr-equals'],
      style: {
        color: 'var(--color-slate-500)',
      },
    },
    {
      types: ['attr-name', 'keyword', 'rule', 'pseudo-class', 'important'],
      style: {
        color: 'var(--color-slate-300)',
      },
    },
    {
      types: ['tag', 'class-name', 'selector', 'function', 'module'],
      style: {
        color: 'var(--color-pink-400)',
      },
    },
    {
      types: ['attr-value', 'class', 'string', 'property'],
      style: {
        color: 'var(--accent-300, var(--color-primary-300))',
      },
    },
    {
      types: ['unit'],
      style: {
        color: 'var(--color-teal-200)',
      },
    },
  ],
}
