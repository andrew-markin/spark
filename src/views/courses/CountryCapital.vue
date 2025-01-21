<template>
  <country-course-page course="country-capital" title="Country - Capital">
    <template #question="{ option }">
      <div class="text-h4 text-primary text-center">
        {{ option.name[locale] }}
      </div>
    </template>
    <template #answer="{ option }">
      <div class="text-h4 text-primary text-center">
        {{ option.capital[locale] }}
      </div>
    </template>
  </country-course-page>
</template>

<script>
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

import CountryCoursePage from '@/components/CountryCoursePage.vue'
import { useMainStore } from '@/stores/main'

export default defineComponent({
  components: {
    CountryCoursePage
  },
  computed: {
    ...mapState(useMainStore, ['locale'])
  }
})
</script>
