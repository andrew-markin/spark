import { afterEach, describe, expect, it, vi } from 'vitest'

import countries from '@/dataset.js'
import {
  COOLDOWN,
  getWeight,
  isNew,
  levelWeight,
  MISTAKE_WEIGHT,
  pickOption,
  recheckInterval
} from '@/trainer'

afterEach(() => {
  vi.restoreAllMocks()
})

const option = (level, asked, confirms = 0) => ({ level, asked, confirms })

describe('getWeight', () => {
  it('prefers new options of higher levels', () => {
    for (let level = 1; level < 10; level++) {
      expect(getWeight(option(level + 1), 0)).toBeGreaterThan(getWeight(option(level), 0))
    }
  })

  it('treats options never asked as new, the first answer at iteration 0 included', () => {
    expect(isNew(option(5))).toBe(true)
    expect(isNew(option(5, null))).toBe(true)
    expect(isNew(option(5, 0))).toBe(false)
  })

  it('hardly asks an answered option within the next questions', () => {
    for (const confirms of [0, 1, 5]) {
      for (let since = 1; since <= COOLDOWN; since++) {
        const weight = getWeight(option(10, 100, confirms), 100 + since)
        expect(weight).toBeLessThan(levelWeight(1))
      }
    }
  })

  it('asks a mistake before any new option once the cooldown is over', () => {
    const weight = getWeight(option(1, 100, 0), 101 + COOLDOWN)
    expect(weight).toBe(MISTAKE_WEIGHT)
    expect(weight).toBeGreaterThan(getWeight(option(10), 0))
  })

  it('asks a correct answer less than a new option until a recheck is due, then more', () => {
    const fresh = getWeight(option(7), 200)
    const since = (confirms) => 100 - recheckInterval(confirms)
    for (const confirms of [1, 2, 3]) {
      expect(getWeight(option(7, since(confirms) + 1, confirms), 100)).toBeLessThan(fresh)
      expect(getWeight(option(7, since(confirms), confirms), 100)).toBeGreaterThan(fresh)
    }
  })

  it('checks again later the more times in a row the answer was correct', () => {
    expect(recheckInterval(1)).toBeGreaterThanOrEqual(20)
    for (let confirms = 1; confirms < 5; confirms++) {
      expect(recheckInterval(confirms + 1)).toBeGreaterThan(recheckInterval(confirms))
    }
  })
})

describe('pickOption', () => {
  it('picks among the given options', () => {
    const options = [option(1), option(2)]
    expect(options).toContain(pickOption(options, 0))
    expect(pickOption([], 0)).toBeUndefined()
  })

  // A learner who knows a part of the countries, the more the better known they are,
  // and learns a mistaken one with a chance of a half every time it comes back
  function simulate(questions) {
    let seed = 1
    vi.spyOn(Math, 'random').mockImplementation(
      () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    )
    const options = countries.map((country) => ({
      ...country,
      asked: undefined,
      confirms: 0,
      known: Math.random() < 0.05 + 0.09 * (country.level - 1)
    }))
    const stats = { repeats: 0, mistakeGaps: [] }
    const mistakes = new Map()
    for (let iteration = 0; iteration < questions; iteration++) {
      const picked = pickOption(options, iteration)
      if (!isNew(picked) && iteration - picked.asked <= COOLDOWN) stats.repeats++
      if (mistakes.has(picked)) stats.mistakeGaps.push(iteration - mistakes.get(picked))
      mistakes.delete(picked)
      if (!picked.known && !isNew(picked) && Math.random() < 0.5) picked.known = true
      if (picked.known) picked.confirms++
      else {
        picked.confirms = 0
        mistakes.set(picked, iteration)
      }
      picked.asked = iteration
    }
    stats.learned = options.filter((option) => option.confirms > 0).length / options.length
    return stats
  }

  it('brings mistakes back soon, never right away, and keeps the learning going', () => {
    const { repeats, mistakeGaps, learned } = simulate(1000)
    const averageGap = mistakeGaps.reduce((sum, gap) => sum + gap, 0) / mistakeGaps.length
    expect(repeats).toBe(0)
    expect(averageGap).toBeGreaterThan(COOLDOWN)
    expect(averageGap).toBeLessThan(15)
    expect(learned).toBeGreaterThan(0.7)
  })
})
