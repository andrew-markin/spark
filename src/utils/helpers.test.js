import { afterEach, describe, expect, it, vi } from 'vitest'

import { selectRandomly } from '@/utils/helpers'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('selectRandomly', () => {
  it('returns undefined for missing or empty options', () => {
    expect(selectRandomly()).toBeUndefined()
    expect(selectRandomly([])).toBeUndefined()
  })

  it('picks the option whose stake range contains the random value', () => {
    const options = [
      ['a', 1],
      ['b', 2],
      ['c', 1]
    ]
    const pick = (random) => {
      vi.spyOn(Math, 'random').mockReturnValue(random)
      return selectRandomly(options)
    }
    expect(pick(0.2)).toBe('a')
    expect(pick(0.3)).toBe('b')
    expect(pick(0.7)).toBe('b')
    expect(pick(0.8)).toBe('c')
    expect(pick(0.999)).toBe('c')
  })

  it('follows the given probabilities', () => {
    const options = [
      ['rare', 1],
      ['common', 9]
    ]
    const counts = { rare: 0, common: 0 }
    for (let i = 0; i < 10000; i++) counts[selectRandomly(options)]++
    expect(counts.rare / 10000).toBeCloseTo(0.1, 1)
  })
})
