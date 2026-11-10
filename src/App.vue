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
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
}

@media (min-width: 550px) {
  .container {
    width: 500px;
  }
}
</style>
