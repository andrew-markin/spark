<template>
  <div class="container column no-wrap" :class="{ 'q-pa-sm': !mobileScreen }">
    <q-card class="col column no-wrap shadow-5" :flat="mobileScreen" :square="mobileScreen">
      <router-view />
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const mobileScreen = computed(() => $q.screen.width < 800)
</script>

<style lang="scss">
// The page background is set on html in index.html, so it is there before the app loads
body,
body.body--dark {
  background: transparent;
}
</style>

<style scoped lang="scss">
.container {
  position: absolute;
  /* Below the status bar of the installed app on iOS, see index.html */
  top: env(safe-area-inset-top, 0px);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

/* With the app drawn under the status bar, iOS still ends the page that much short of the
   bottom of the screen, while the visible height reaches it */
@supports (height: 100dvh) {
  .container {
    bottom: auto;
    height: calc(100dvh - env(safe-area-inset-top, 0px));
  }
}

@media (min-width: 550px) {
  .container {
    width: 500px;
  }
}
</style>
