<template>
  <q-card-section class="bg-primary text-white q-pa-sm row items-center">
    <q-btn flat round icon="img:spark.svg" :to="{ name: 'home' }" />
    <span class="text-subtitle1 text-weight-medium non-selectable">{{ title }}</span>
  </q-card-section>
  <slot></slot>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    title: { type: String, default: undefined }
  }
})
</script>
