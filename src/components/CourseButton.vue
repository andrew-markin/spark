<template>
  <menu-button :to="{ name: course.name }">
    <div class="row">
      <div>{{ course.title }}</div>
      <q-space></q-space>
      <div>{{ scoreLabel }}</div>
    </div>
  </menu-button>
</template>

<script setup>
import { useI18n } from 'petite-vue-i18n'
import { computed } from 'vue'

import { formatPercent } from '@/i18n'
import { useMainStore } from '@/stores/main'

import MenuButton from './MenuButton.vue'

const props = defineProps({ course: { type: Object, default: undefined } })

const store = useMainStore()
const { locale } = useI18n()
const scoreLabel = computed(() => formatPercent(store.getScore(props.course.name), locale.value))
</script>

<style scoped>
/* Letters centered like in the other buttons (see CardButton), the title and the score are
   flex items here, which the trimming there doesn't reach */
.row > div {
  text-box: trim-both cap alphabetic;
}
</style>
