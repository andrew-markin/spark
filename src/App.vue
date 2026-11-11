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
  /* Fixed, as it may reach beyond the page (see below), which must not make the page scroll */
  position: fixed;
  /* Below the status bar of the installed app on iOS, see index.html */
  top: env(safe-area-inset-top, 0px);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

/* Installed on iOS, with the app drawn under the status bar (see index.html), WebKit still
   takes the status bar off the height of the page, which then ends that much short of the
   bottom of the screen. So there the app is as high as the page, starting below the status
   bar. Only iOS supports -webkit-touch-callout, other browsers count the height right. */
@supports (-webkit-touch-callout: none) {
  @media (display-mode: standalone) {
    .container {
      bottom: auto;
      height: 100dvh;
    }
  }
}

@media (min-width: 550px) {
  .container {
    width: 500px;
  }
}
</style>
