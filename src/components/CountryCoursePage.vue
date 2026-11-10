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

<script setup>
import { computed, ref } from 'vue'

import CoursePage from '@/components/CoursePage.vue'
import countries from '@/dataset.js'
import { useMainStore } from '@/stores/main'
import { pickOption } from '@/trainer'

const props = defineProps({
  course: { type: String, default: undefined },
  title: { type: String, default: undefined }
})

const store = useMainStore()

const options = ref([])
const option = ref()
const iteration = ref(0)
const revealed = ref(false)

const score = computed(() => store.getScore(props.course))

function reset() {
  revealed.value = false
  option.value = pickOption(options.value, iteration.value)
}

function save() {
  store.saveContext(props.course, {
    iteration: iteration.value,
    variables: options.value.map(({ code, asked, confirms }) => [code, { asked, confirms }])
  })
  const confirmed = options.value.filter((option) => option.confirms > 0).length
  store.saveScore(props.course, (confirmed * 100) / options.value.length)
}

function grade(success) {
  if (!option.value) return
  if (success) option.value.confirms++
  else option.value.confirms = 0
  option.value.asked = iteration.value++
  save()
  reset()
}

function drop() {
  iteration.value = 0
  for (const option of options.value) {
    option.asked = undefined
    option.confirms = 0
  }
  save()
  reset()
}

// Progress of earlier visits, options are matched by country code, so the countries
// added to or removed from the dataset since then are taken care of
const context = { iteration: 0, variables: [], ...store.restoreContext(props.course) }
const variables = new Map(Array.isArray(context.variables) ? context.variables : [])
iteration.value = context.iteration
options.value = countries.map((country) => ({
  ...country,
  asked: undefined,
  confirms: 0,
  ...variables.get(country.code)
}))
save()
reset()
</script>
