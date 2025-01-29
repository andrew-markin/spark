<template>
  <q-card
    v-ripple
    flat
    class="non-selectable cursor-pointer q-hoverable bg-secondary text-white q-pa-none"
    @click="route()"
  >
    <span class="q-focus-helper"></span>
    <q-card-section class="q-pa-sm">
      <q-icon v-if="icon" left :name="icon" size="2rem" />
      <slot></slot>
    </q-card-section>
  </q-card>
</template>

<script>
import { openURL } from 'quasar'
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    to: { type: Object, default: undefined },
    href: { type: String, default: undefined },
    icon: { type: String, default: undefined }
  },
  methods: {
    route() {
      if (this.to) return this.$router.push(this.to)
      if (this.href) return openURL(this.href)
    }
  }
})
</script>
