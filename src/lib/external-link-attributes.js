export function mergeRel(existing, ...required) {
  const values = new Set(
    typeof existing === 'string' ? existing.split(/\s+/).filter(Boolean) : [],
  )

  for (const value of required) {
    if (value) {
      values.add(value)
    }
  }

  return values.size > 0 ? [...values].join(' ') : undefined
}
