import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    const scores = JSON.parse(localStorage.getItem('scores')) || []
    return {
      locale: 'ru',
      locales: [
        { label: 'English', value: 'en' },
        { label: 'Русский', value: 'ru' }
      ],
      theme: undefined,
      themes: [
        { label: 'System', value: undefined },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' }
      ],
      scores
    }
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
      localStorage.setItem('scores', JSON.stringify(this.scores))
    },
    saveContext(course, value) {
      localStorage.setItem(`course-context#${course}`, JSON.stringify(value))
    },
    restoreContext(course) {
      return JSON.parse(localStorage.getItem(`course-context#${course}`))
    }
  }
})
