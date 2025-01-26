<template>
  <scrollable-page title="Settings">
    <div class="text-h6 q-pa-md q-my-md">
      <div class="q-mb-md">Language:</div>
      <q-option-group v-model="locale" size="xl" :options="locales" type="radio" />
    </div>
    <div class="text-h6 q-pa-md q-my-md">
      <div class="q-mb-md">Theme:</div>
      <q-option-group v-model="theme" size="xl" :options="themes" type="radio" />
    </div>
  </scrollable-page>
</template>

<script>
import { mapState, mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

import ScrollablePage from '@/components/ScrollablePage.vue'
import { useMainStore } from '@/stores/main'

export default defineComponent({
  components: {
    ScrollablePage
  },
  computed: {
    ...mapState(useMainStore, ['locales', 'themes']),
    ...mapWritableState(useMainStore, ['locale', 'theme'])
  }
})
</script>
