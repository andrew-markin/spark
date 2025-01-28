<template>
  <scrollable-page :title="$t('_APP_TITLE')">
    <template #corner>
      <div class="text-h6 non-selectable muted">{{ $t('APP_VERSION', { number: version }) }}</div>
    </template>
    <course-button v-for="course of courses" :key="course.name" :course="course" />
    <menu-button :to="{ name: 'settings' }" class="q-mt-xl">{{ $t('SETTINGS') }}</menu-button>
    <menu-button :to="{ name: 'about' }">{{ $t('ABOUT') }}</menu-button>
  </scrollable-page>
</template>

<script>
import { defineComponent } from 'vue'

import CourseButton from '@/components/CourseButton.vue'
import MenuButton from '@/components/MenuButton.vue'
import ScrollablePage from '@/components/ScrollablePage.vue'

export default defineComponent({
  components: {
    CourseButton,
    MenuButton,
    ScrollablePage
  },
  computed: {
    version() {
      return import.meta.env.APP_VERSION
    },
    courses() {
      return [
        { title: this.$t('COURSE_COUNTRY_CAPITAL'), name: 'country-capital' },
        { title: this.$t('COURSE_CAPITAL_COUNTRY'), name: 'capital-country' },
        { title: this.$t('COURSE_FLAG_COUNTRY'), name: 'flag-country' },
        { title: this.$t('COURSE_COUNTRY_FLAG'), name: 'country-flag' }
      ]
    }
  }
})
</script>

<style scoped>
.muted {
  opacity: 0.25;
}
</style>
