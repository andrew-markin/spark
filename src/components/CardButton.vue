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
    <!-- The icon and the letters themselves are centered, see the styles -->
    <q-card-section class="content q-pa-sm row no-wrap items-center">
      <q-icon v-if="icon" left :name="icon" size="2rem" />
      <div class="text col"><slot></slot></div>
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

/* The space a line of text keeps above and below its letters comes from the font metrics,
   rounded to whole device pixels, so at scales like 125% the letters sat about a pixel high.
   Trimmed to the capitals and the baseline, the letters are centered next to the icon, in
   browsers without text-box the line is centered as before. The buttons keep the height of
   a line, as the text alone is shorter now. */
.content {
  min-height: calc(2rem + 16px);
}

.text {
  text-box: trim-both cap alphabetic;
}
</style>
