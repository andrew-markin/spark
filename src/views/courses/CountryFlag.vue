<template>
  <country-course-page course="country-flag" :title="$t('COURSE_COUNTRY_FLAG')">
    <template #question="{ option }">
      <div class="text-h4 text-primary text-center">
        {{ option.name[$i18n.locale] }}
      </div>
    </template>
    <template #answer="{ option }">
      <img :src="`/flags/${option.code}.svg`" class="flag" />
    </template>
  </country-course-page>
</template>

<script>
import { defineComponent } from 'vue'

import CountryCoursePage from '@/components/CountryCoursePage.vue'

export default defineComponent({
  components: {
    CountryCoursePage
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
  border: 3px solid $grey-8;
  padding: 2px;
}
</style>
