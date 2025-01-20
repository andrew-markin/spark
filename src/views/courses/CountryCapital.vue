<template>
  <course-page v-model="revealed" title="Country - Capital" @grade="grade">
    <template #corner>
      <q-chip
        dense
        non-selectable
        clickable
        class="text-subtitle1 bg-white text-primary q-px-sm"
        @click="drop()"
      >
        {{ scoreLabel }}%
      </q-chip>
    </template>
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
  data: () => ({
    options: [],
    selection: undefined,
    iteration: 0,
    language: 'ru',
    revealed: false,
    course: 'country-capital'
  }),
  computed: {
    ...mapState(useMainStore, ['getScore']),
    question() {
      return this.selection?.name[this.language]
    },
    answer() {
      return this.selection?.capital[this.language]
    },
    scoreLabel() {
      return this.getScore(this.course, 2)
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
      this.selection = selectRandomly(this.options.map((option) => [option, option.level * 100]))
    },
    grade(success) {
      if (success) this.selection.confirms++
      else this.selection.confirms = 0
      this.selection.asked = this.iteration++
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
