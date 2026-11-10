import { selectRandomly } from '@/utils/helpers'

// How likely each option is to be asked next. Options are countries with a level from 1 to 10
// (see dataset.js, the more populous the country, the higher its level), `asked` is the
// iteration the option was last answered at, undefined if never, and `confirms` is the number
// of correct answers in a row.

// Every level doubles the weight, so well known countries come first and the less known
// ones join in gradually
export const levelWeight = (level) => 2 ** (level - 1)

// Answered options are left out for the next few questions, so they don't come back
// while still in mind
export const COOLDOWN = 5
const COOLDOWN_FACTOR = 0.001

// A mistake comes back soon, well before new options, whatever its level. The weight
// is eight times one of a new option of the highest level, so at the start of a course,
// with all the new options around, a mistake returns within about ten questions.
export const MISTAKE_WEIGHT = 8 * levelWeight(10)

// A correct answer is checked again after a while, the longer the more times in a row
// it was correct: 20 questions after the first one, 60 after the second, 180 after the third.
// Until then it is hardly asked, so as not to distract from the rest, and once due a little
// more than a new option of its level. Checks growing slower, or asked more often before
// they are due, take up most of the questions as more and more is learned, and new options
// stop coming (as simulated with a learner who learns a mistake with a chance of a half).
export const RECHECK_INTERVAL = 20
const RECHECK_GROWTH = 3
const PENDING_FACTOR = 0.05
const DUE_FACTOR = 1.2

export const recheckInterval = (confirms) => RECHECK_INTERVAL * RECHECK_GROWTH ** (confirms - 1)

export const isNew = (option) => option.asked === undefined || option.asked === null

export function getWeight(option, iteration) {
  const weight = levelWeight(option.level)
  if (isNew(option)) return weight
  const since = iteration - option.asked
  if (since <= COOLDOWN) return weight * COOLDOWN_FACTOR
  if (option.confirms <= 0) return MISTAKE_WEIGHT
  if (since < recheckInterval(option.confirms)) return weight * PENDING_FACTOR
  return weight * DUE_FACTOR
}

export function pickOption(options, iteration) {
  return selectRandomly(options.map((option) => [option, getWeight(option, iteration)]))
}
