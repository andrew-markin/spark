import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import 'quasar/src/css/index.sass'

import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { createApp } from 'vue'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import { getPreferredDarkMode } from './utils/theme'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.use(Quasar, {
  plugins: {},
  config: {
    dark: getPreferredDarkMode()
  }
})

app.mount('#app')
