<template>
  <!-- Reachable with Tab and pressed with Enter or Space, the focus shown like the hover -->
  <q-card
    v-ripple
    flat
    role="button"
    tabindex="0"
    class="non-selectable cursor-pointer q-hoverable q-focusable bg-secondary text-white q-pa-none"
    @click="route()"
    @keydown.enter.space.prevent.stop="$event.currentTarget.click()"
  >
    <span class="q-focus-helper"></span>
    <q-card-section class="q-pa-sm">
      <q-icon v-if="icon" left :name="icon" size="2rem" />
      <slot></slot>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { openURL } from 'quasar'
import { useRouter } from 'vue-router'

const props = defineProps({
  to: { type: Object, default: undefined },
  href: { type: String, default: undefined },
  icon: { type: String, default: undefined }
})

const router = useRouter()

function route() {
  if (props.to) return router.replace(props.to)
  if (props.href) return openURL(props.href)
}
</script>

<style scoped>
/* Quasar's focus highlight is a light veil, hardly seen on the light blue buttons */
.q-focusable:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -5px;
}
</style>
