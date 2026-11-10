import '@quasar/extras/roboto-font/roboto-font.css'
import 'quasar/src/css/index.sass'
import '@/style/main.css'

import { createPinia } from 'pinia'
import { Dark, Quasar } from 'quasar'
import { createApp, watchEffect } from 'vue'

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

// The page background follows the theme, see index.html
watchEffect(() => {
  document.documentElement.dataset.theme = Dark.isActive ? 'dark' : 'light'
})

app.mount('#app')

// Reveal the app once the fonts its text needs are loaded, so it doesn't flash
// in a fallback font. Hidden text is still laid out, which starts font loading.
// Give up waiting after a while in case the fonts can't be loaded at all.
const root = document.querySelector('#app')
void root.offsetHeight // Lay out right away, without waiting for a frame
const timeout = new Promise((resolve) => setTimeout(resolve, 3000))
Promise.race([document.fonts.ready, timeout]).then(() => root.classList.add('ready'))

// Safari ignores user-scalable=no in the viewport (see index.html), so block pinch zoom directly
const preventDefault = (event) => event.preventDefault()
document.addEventListener('gesturestart', preventDefault)
document.addEventListener('gesturechange', preventDefault)
document.addEventListener('gestureend', preventDefault)
