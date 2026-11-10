import { describe, expect, it } from 'vitest'

import { formatPercent } from '@/i18n'

describe('formatPercent', () => {
  it('writes scores the way the language does', () => {
    expect(formatPercent(0.41, 'en')).toBe('0.41%')
    expect(formatPercent(0.41, 'ru')).toBe('0,41 %')
    expect(formatPercent(100, 'en')).toBe('100.00%')
  })

  it('treats a missing score as zero', () => {
    expect(formatPercent(undefined, 'en')).toBe('0.00%')
  })
})
