<template>
  <course-page v-model="revealed" title="Country - Capital" @grade="grade">
    <template #question>
      <div class="text-h4 text-primary text-center">
        {{ question }}
      </div>
    </template>
    <template #answer>
      <div class="text-h4 text-primary text-center">
        {{ answer }}
      </div>
    </template>
  </course-page>
</template>

<script>
import { defineComponent } from 'vue'

import CoursePage from '@/components/CoursePage.vue'
import { countries } from '@/dataset'
import { selectRandomly } from '@/utils/helpers'

export default defineComponent({
  components: {
    CoursePage
  },
  data: () => ({
    options: [],
    selection: undefined,
    iteration: 0,
    language: 'ru',
    revealed: false
  }),
  computed: {
    question() {
      return this.selection?.name[this.language]
    },
    answer() {
      return this.selection?.capital[this.language]
    }
  },
  mounted() {
    this.iteration = 0 // TODO: Load from storage
    // TODO: Load lastAskIteration and correctAnswersCount from storage
    this.options = countries.map((country) => ({
      ...country,
      lastAskIteration: 0,
      correctAnswersCount: 0
    }))
    this.reset()
  },
  methods: {
    reset() {
      this.revealed = false
      this.selection = selectRandomly(this.options.map((option) => [option, option.level * 100]))
    },
    grade(success) {
      if (success) this.selection.correctAnswersCount++
      else this.selection.correctAnswersCount = 0
      this.selection.lastAskIteration = this.iteration++
      // TODO: Update local stats
      this.reset()
    }
  }
})
</script>
