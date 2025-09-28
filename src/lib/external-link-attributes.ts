export function mergeRel(
  existing?: string | null,
  ...required: Array<string | null | undefined>
): string | undefined {
  const initialValues =
    typeof existing === 'string' ? existing.split(/\s+/).filter(Boolean) : []
  const values = new Set(initialValues)

  for (const value of required) {
    if (typeof value === 'string' && value) {
      values.add(value)
    }
  }

  return values.size > 0 ? [...values].join(' ') : undefined
}
