<template>
  <!-- Flags are files of their own, precached by the service worker along with the app,
       so all of them are there offline (see vite.config.js) -->
  <img v-if="code" :src="src" width="640" height="480" alt="" class="flag" draggable="false" />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: { code: { type: String, default: undefined } },
  computed: {
    src() {
      return `${import.meta.env.BASE_URL}flags/${this.code.toLowerCase()}.svg`
    }
  }
})
</script>

<style scoped lang="scss">
.flag {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 3px solid $secondary;
  padding: 3px;
}
</style>
