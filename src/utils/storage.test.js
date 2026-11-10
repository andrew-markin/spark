import { afterEach, describe, expect, it, vi } from 'vitest'

import { readItem, removeItem, writeItem } from '@/utils/storage'

afterEach(() => {
  vi.unstubAllGlobals()
})

const memoryStorage = (items = {}) => ({
  getItem: (key) => (key in items ? items[key] : null),
  setItem: (key, value) => (items[key] = String(value)),
  removeItem: (key) => delete items[key]
})

const brokenStorage = () => {
  const fail = () => {
    throw new Error('SecurityError')
  }
  return { getItem: fail, setItem: fail, removeItem: fail }
}

describe('storage', () => {
  it('keeps values as JSON', () => {
    vi.stubGlobal('localStorage', memoryStorage())
    writeItem('scores', [{ course: 'flag-country', value: 5 }])
    expect(readItem('scores')).toEqual([{ course: 'flag-country', value: 5 }])
    removeItem('scores')
    expect(readItem('scores', [])).toEqual([])
  })

  it('falls back on damaged values', () => {
    vi.stubGlobal('localStorage', memoryStorage({ scores: '{broken' }))
    expect(readItem('scores', [])).toEqual([])
  })

  it('works without storage', () => {
    vi.stubGlobal('localStorage', brokenStorage())
    expect(readItem('dark', 'auto')).toBe('auto')
    expect(() => writeItem('dark', true)).not.toThrow()
    expect(() => removeItem('dark')).not.toThrow()
  })
})
