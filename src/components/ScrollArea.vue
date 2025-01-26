<template>
  <q-scroll-area :thumb-style="thumbStyle">
    <slot></slot>
  </q-scroll-area>
</template>

<script>
import { colors } from 'quasar'
import { defineComponent } from 'vue'

export default defineComponent({
  computed: {
    thumbStyle() {
      return {
        borderRadius: '0px',
        backgroundColor: colors.getPaletteColor('primary'),
        width: '5px',
        opacity: '0.75'
      }
    }
  }
})
</script>
