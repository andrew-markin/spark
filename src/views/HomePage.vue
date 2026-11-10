<template>
  <scrollable-page :title="$t('_APP_TITLE')">
    <template #corner>
      <div class="text-h6 non-selectable muted">{{ $t('APP_VERSION', { number: version }) }}</div>
    </template>
    <course-button v-for="course of courses" :key="course.name" :course="course" />
    <menu-button :icon="fasScrewdriverWrench" :to="{ name: 'settings' }" class="q-mt-xl">
      {{ $t('SETTINGS') }}
    </menu-button>
    <menu-button :icon="fasLightbulb" :to="{ name: 'about' }">
      {{ $t('ABOUT') }}
    </menu-button>
  </scrollable-page>
</template>

<script setup>
import { fasLightbulb, fasScrewdriverWrench } from '@quasar/extras/fontawesome-v7'
import { useI18n } from 'petite-vue-i18n'
import { computed } from 'vue'

import CourseButton from '@/components/CourseButton.vue'
import MenuButton from '@/components/MenuButton.vue'
import ScrollablePage from '@/components/ScrollablePage.vue'
import { version } from '@/consts'

const { t } = useI18n()

const courses = computed(() => [
  { title: t('COURSE_COUNTRY_CAPITAL'), name: 'country-capital' },
  { title: t('COURSE_CAPITAL_COUNTRY'), name: 'capital-country' },
  { title: t('COURSE_FLAG_COUNTRY'), name: 'flag-country' },
  { title: t('COURSE_COUNTRY_FLAG'), name: 'country-flag' }
])
</script>

<style scoped>
.muted {
  opacity: 0.25;
}
</style>
