<template>
  <course-page v-model="revealed" :title="title" :score="score" @grade="grade" @drop="drop">
    <template v-if="option" #question>
      <slot name="question" :option="option"></slot>
    </template>
    <template v-if="option" #answer>
      <slot name="answer" :option="option"></slot>
    </template>
  </course-page>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'

import CoursePage from '@/components/CoursePage.vue'
import { countries } from '@/dataset'
import { useMainStore } from '@/stores/main'
import { selectRandomly } from '@/utils/helpers'

export default defineComponent({
  components: {
    CoursePage
  },
  props: {
    course: { type: String, default: undefined },
    title: { type: String, default: undefined }
  },
  data: () => ({
    options: [],
    option: undefined,
    iteration: 0,
    revealed: false
  }),
  computed: {
    ...mapState(useMainStore, ['getScore']),
    score() {
      return this.getScore(this.course)
    }
  },
  mounted() {
    const { iteration, variables } = {
      iteration: 0,
      variables: [],
      ...this.restoreContext(this.course)
    }
    this.iteration = iteration
    const variablesMap = new Map(variables)
    this.options = countries.map((country) => {
      return {
        ...country,
        ...{
          asked: undefined,
          confirms: 0,
          ...variablesMap.get(country.code)
        }
      }
    })
    this.save()
    this.reset()
  },
  methods: {
    ...mapActions(useMainStore, ['saveScore', 'saveContext', 'restoreContext']),
    reset() {
      this.revealed = false
      this.option = selectRandomly(this.options.map((option) => [option, option.level * 100]))
    },
    grade(success) {
      if (success) this.option.confirms++
      else this.option.confirms = 0
      this.option.asked = this.iteration++
      this.save()
      this.reset()
    },
    save() {
      this.saveContext(this.course, {
        iteration: this.iteration,
        variables: this.options.map(({ code, asked, confirms }) => [code, { asked, confirms }])
      })
      let confirmsCount = 0
      for (const option of this.options) {
        if (option.confirms > 0) confirmsCount++
      }
      const score = (confirmsCount * 100) / this.options.length
      this.saveScore(this.course, score)
    },
    drop() {
      for (const option of this.options) {
        option.asked = undefined
        option.confirms = 0
      }
      this.save()
    }
  }
})
</script>
