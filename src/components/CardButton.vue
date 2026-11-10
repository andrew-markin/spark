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
