<template>
  <menu-button :to="{ name: course.name }">
    <div class="row">
      <div>{{ course.title }}</div>
      <q-space></q-space>
      <div>{{ scoreLabel }}%</div>
    </div>
  </menu-button>
</template>

<script>
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

import { useMainStore } from '@/stores/main'

import MenuButton from './MenuButton.vue'

export default defineComponent({
  components: {
    MenuButton
  },
  props: {
    course: { type: Object, default: undefined }
  },
  computed: {
    ...mapState(useMainStore, ['getScore']),
    score() {
      return this.getScore(this.course.name)
    },
    scoreLabel() {
      return Number(this.score || 0).toFixed(2)
    }
  }
})
</script>
