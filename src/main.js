import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import 'quasar/src/css/index.sass'
import '@/style/main.css'

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

setTimeout(() => {
  if (navigator.userAgent.indexOf('iPhone') === -1) return
  const viewport = document.querySelector('[name=viewport]')
  if (viewport) {
    viewport?.setAttribute('content', viewport.getAttribute('content') + ', maximum-scale=1')
  }
  const preventDefault = (event) => event.preventDefault()
  document.addEventListener('gesturestart', preventDefault)
  document.addEventListener('gesturechange', preventDefault)
  document.addEventListener('gestureend', preventDefault)
}, 200)
