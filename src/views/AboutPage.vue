<template>
  <scrollable-page :title="$t('ABOUT')">
    <div class="text-h6 q-pa-md q-my-md">
      <div class="q-mb-md">...</div>
    </div>
  </scrollable-page>
</template>

<script>
import { defineComponent } from 'vue'

import ScrollablePage from '@/components/ScrollablePage.vue'

export default defineComponent({
  components: {
    ScrollablePage
  }
})
</script>
