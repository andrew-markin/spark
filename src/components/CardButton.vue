<template>
  <q-card
    v-ripple
    flat
    class="non-selectable cursor-pointer q-hoverable bg-primary text-white q-pa-none"
    @click="to && $router.push(to)"
  >
    <span class="q-focus-helper"></span>
    <q-card-section class="q-pa-sm">
      <slot></slot>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    to: { type: Object, default: undefined }
  }
})
</script>
