<template>
  <scrollable-page :title="$t('SETTINGS')">
    <div class="text-h6 q-pa-md q-my-md">
      <div class="q-mb-md">{{ $t('LANGUAGE') }}:</div>
      <q-option-group v-model="locale" size="xl" :options="locales" type="radio" />
    </div>
    <div class="text-h6 q-pa-md q-my-md">
      <div class="q-mb-md">{{ $t('THEME') }}:</div>
      <q-option-group v-model="dark" size="xl" :options="themes" type="radio" />
    </div>
  </scrollable-page>
</template>

<script setup>
import { useI18n } from 'petite-vue-i18n'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

import ScrollablePage from '@/components/ScrollablePage.vue'
import { setLocale } from '@/i18n'
import { setPreferredDarkMode } from '@/utils/theme'

const $q = useQuasar()
const i18n = useI18n()
const { t } = i18n

const locale = computed({
  get: () => i18n.locale.value,
  set: (value) => setLocale(value)
})

// Every language is named in itself
const locales = computed(() =>
  i18n.availableLocales.map((locale) => ({
    label: t('_LOCALE_TITLE', 1, { locale }),
    value: locale
  }))
)

const dark = computed({
  get: () => $q.dark.mode,
  set: (value) => {
    setPreferredDarkMode(value)
    $q.dark.set(value)
  }
})

const themes = computed(() => [
  { label: t('THEME_SYSTEM'), value: 'auto' },
  { label: t('THEME_LIGHT'), value: false },
  { label: t('THEME_DARK'), value: true }
])
</script>
