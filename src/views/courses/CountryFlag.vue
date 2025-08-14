<template>
  <country-course-page course="country-flag" :title="$t('COURSE_COUNTRY_FLAG')">
    <template #question="{ option }">
      <div class="text-h4 text-secondary text-center">
        {{ option.name[$i18n.locale] }}
      </div>
    </template>
    <template #answer="{ option }">
      <country-flag-image :code="option.code" />
    </template>
  </country-course-page>
</template>

<script>
import { defineComponent } from 'vue'

import CountryCoursePage from '@/components/CountryCoursePage.vue'
import CountryFlagImage from '@/components/CountryFlagImage.vue'

export default defineComponent({ components: { CountryCoursePage, CountryFlagImage } })
</script>
