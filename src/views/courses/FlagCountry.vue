<template>
  <country-course-page course="flag-country" :title="$t('COURSE_FLAG_COUNTRY')">
    <template #question="{ option }">
      <country-flag-image :code="option.code" />
    </template>
    <template #answer="{ option }">
      <div class="text-h4 text-primary text-center">
        {{ option.name[$i18n.locale] }}
      </div>
    </template>
  </country-course-page>
</template>

<script>
import { defineComponent } from 'vue'

import CountryCoursePage from '@/components/CountryCoursePage.vue'
import CountryFlagImage from '@/components/CountryFlagImage.vue'

export default defineComponent({
  components: {
    CountryCoursePage,
    CountryFlagImage
  }
})
</script>
