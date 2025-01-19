<template>
  <q-card
    v-ripple
    flat
    class="non-selectable cursor-pointer q-hoverable bg-primary text-white q-pa-none"
  >
    <span class="q-focus-helper"></span>
    <q-card-section class="text-center q-pa-sm">
      <slot></slot>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    dense: { type: Boolean, default: false }
  }
})
</script>
