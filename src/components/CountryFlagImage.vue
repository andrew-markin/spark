<template>
  <img v-if="valid" :src="url" class="flag" />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    code: { type: String, default: undefined }
  },
  computed: {
    valid() {
      return this.code && /^([a-z]{2})$/.test(this.code)
    },
    url() {
      return `/flags/${this.code}.svg`
    }
  }
})
</script>

<style scoped lang="scss">
.flag {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  border: 3px solid $secondary;
  padding: 3px;
}
</style>
