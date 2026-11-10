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

<script>
import { defineComponent } from 'vue'

import ScrollablePage from '@/components/ScrollablePage.vue'
import { setLocale } from '@/i18n'
import { setPreferredDarkMode } from '@/utils/theme'

export default defineComponent({
  components: { ScrollablePage },
  computed: {
    locale: {
      get() {
        return this.$i18n.locale
      },
      set(value) {
        setLocale(value)
      }
    },
    locales() {
      return this.$i18n.availableLocales.map((locale) => ({
        label: this.$t('_LOCALE_TITLE', 1, { locale }),
        value: locale
      }))
    },
    dark: {
      get() {
        return this.$q.dark.mode
      },
      set(value) {
        setPreferredDarkMode(value)
        this.$q.dark.set(value)
      }
    },
    themes() {
      return [
        { label: this.$t('THEME_SYSTEM'), value: 'auto' },
        { label: this.$t('THEME_LIGHT'), value: false },
        { label: this.$t('THEME_DARK'), value: true }
      ]
    }
  }
})
</script>
