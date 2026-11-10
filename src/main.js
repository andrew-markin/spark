import '@quasar/extras/roboto-font/roboto-font.css'
import 'quasar/src/css/index.sass'
import '@/style/main.css'

import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { createApp } from 'vue'

import App from './App.vue'
import i18n, { applyLocale } from './i18n'
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

applyLocale()

app.mount('#app')

// Safari ignores user-scalable=no in the viewport (see index.html), so block pinch zoom directly
const preventDefault = (event) => event.preventDefault()
document.addEventListener('gesturestart', preventDefault)
document.addEventListener('gesturechange', preventDefault)
document.addEventListener('gestureend', preventDefault)
