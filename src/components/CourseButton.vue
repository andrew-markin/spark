<template>
  <menu-button :to="{ name: course.name }">
    <div class="row">
      <div>{{ course.title }}</div>
      <q-space></q-space>
      <div>{{ scoreLabel }}%</div>
    </div>
  </menu-button>
</template>

<script setup>
import { computed } from 'vue'

import { useMainStore } from '@/stores/main'

import MenuButton from './MenuButton.vue'

const props = defineProps({ course: { type: Object, default: undefined } })

const store = useMainStore()
const scoreLabel = computed(() => Number(store.getScore(props.course.name) || 0).toFixed(2))
</script>
