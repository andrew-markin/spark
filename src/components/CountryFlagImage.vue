<template>
  <flag-image :code class="flag" />
</template>

<script>
import { defineComponent } from 'vue'

import FlagImage from '@/components/FlagImage.vue'

export default defineComponent({
  components: { FlagImage },
  props: { code: { type: String, default: undefined } }
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
