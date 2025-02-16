<template>
  <q-card-section class="bg-primary text-white q-pa-sm q-pr-md row items-center">
    <q-btn
      flat
      dense
      round
      size="20px"
      class="q-mr-sm"
      icon="img:spark.svg"
      :to="{ name: 'home' }"
      replace
    />
    <span class="text-h6 text-weight-medium non-selectable">{{ title }}</span>
    <q-space />
    <slot name="corner"></slot>
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
