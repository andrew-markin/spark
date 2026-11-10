import { defineStore } from 'pinia'

import { readItem, writeItem } from '@/utils/storage'

export const useMainStore = defineStore('main', {
  state: () => {
    const scores = readItem('scores', [])
    return { scores: Array.isArray(scores) ? scores : [] }
  },
  getters: {
    getScore: (state) => (course, fractionDigits) => {
      const value = state.scores.find((score) => score.course === course)?.value
      if (value === undefined || fractionDigits === undefined) return value
      return Number(value).toFixed(fractionDigits)
    }
  },
  actions: {
    saveScore(course, value) {
      const score = this.scores.find((score) => score.course === course)
      if (!score) this.scores.push({ course, value })
      else score.value = value
      writeItem('scores', this.scores)
    },
    saveContext(course, value) {
      writeItem(`course-context#${course}`, value)
    },
    restoreContext(course) {
      const context = readItem(`course-context#${course}`)
      return context && typeof context === 'object' ? context : undefined
    }
  }
})
