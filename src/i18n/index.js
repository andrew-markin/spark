import { createI18n } from 'petite-vue-i18n'

import en from './messages/en'
import ru from './messages/ru'

const trimLocale = (locale) => locale && locale.trim().split(/-|_/)[0]
const navigatorLocale = trimLocale(
  navigator.languages !== undefined ? navigator.languages[0] : navigator.language
)

const LOCALE_STORAGE_KEY = 'locale'

export const preferLocale = (value) => {
  if (value !== navigatorLocale) localStorage.setItem(LOCALE_STORAGE_KEY, value)
  else localStorage.removeItem(LOCALE_STORAGE_KEY)
}

export default createI18n({
  locale: localStorage.getItem(LOCALE_STORAGE_KEY) || navigatorLocale || 'en',
  fallbackLocale: 'en',
  messages: { en, ru },
  legacy: false
})
