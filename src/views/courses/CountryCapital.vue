<template>
  <country-course-page course="country-capital" :title="$t('COURSE_COUNTRY_CAPITAL')">
    <template #question="{ option }">
      <div class="text-h4 text-secondary text-center">
        {{ option.name[$i18n.locale] }}
      </div>
    </template>
    <template #answer="{ option }">
      <div class="text-h4 text-secondary text-center">
        {{ option.capital[$i18n.locale] }}
      </div>
    </template>
  </country-course-page>
</template>

<script>
import { defineComponent } from 'vue'

import CountryCoursePage from '@/components/CountryCoursePage.vue'

export default defineComponent({ components: { CountryCoursePage } })
</script>
