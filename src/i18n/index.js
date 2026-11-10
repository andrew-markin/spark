import { createI18n } from 'petite-vue-i18n'

import en from './messages/en'
import ru from './messages/ru'

const messages = { en, ru }

// Only languages there are translations for, so the settings always show one of them chosen
const supportedLocale = (locale) => {
  const language = locale?.trim().split(/-|_/)[0].toLowerCase()
  return language && language in messages ? language : undefined
}

const navigatorLocale =
  (navigator.languages ?? [navigator.language]).map(supportedLocale).find(Boolean) || 'en'

const LOCALE_STORAGE_KEY = 'locale'

// The locale is kept as a plain string, not JSON, as in the earlier versions
const storedLocale = () => {
  try {
    return supportedLocale(localStorage.getItem(LOCALE_STORAGE_KEY))
  } catch {
    return undefined
  }
}

export const preferLocale = (value) => {
  try {
    if (value !== navigatorLocale) localStorage.setItem(LOCALE_STORAGE_KEY, value)
    else localStorage.removeItem(LOCALE_STORAGE_KEY)
  } catch {
    // The choice holds until the page is closed
  }
}

const i18n = createI18n({
  locale: storedLocale() || navigatorLocale,
  fallbackLocale: 'en',
  messages,
  legacy: false
})

// Screen readers and hyphenation follow the language of the page. Quasar sets it to its own
// language on start, so this is to be called once Quasar is installed too.
export const applyLocale = () => (document.documentElement.lang = i18n.global.locale.value)

export const setLocale = (value) => {
  preferLocale(value)
  i18n.global.locale.value = value
  applyLocale()
}

export default i18n
