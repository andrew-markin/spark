import { defineStore } from 'pinia'
import { ref } from 'vue'

import { readItem, writeItem } from '@/utils/storage'

export const useMainStore = defineStore('main', () => {
  const stored = readItem('scores', [])
  const scores = ref(Array.isArray(stored) ? stored : [])

  function getScore(course) {
    return scores.value.find((score) => score.course === course)?.value
  }

  function saveScore(course, value) {
    const score = scores.value.find((score) => score.course === course)
    if (!score) scores.value.push({ course, value })
    else score.value = value
    writeItem('scores', scores.value)
  }

  function saveContext(course, value) {
    writeItem(`course-context#${course}`, value)
  }

  function restoreContext(course) {
    const context = readItem(`course-context#${course}`)
    return context && typeof context === 'object' ? context : undefined
  }

  return { scores, getScore, saveScore, saveContext, restoreContext }
})
