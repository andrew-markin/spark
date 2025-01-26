<template>
  <card-button class="text-h6 q-pa-md q-ma-md"><slot></slot></card-button>
</template>

<script>
import { defineComponent } from 'vue'

import CardButton from './CardButton.vue'

export default defineComponent({
  components: {
    CardButton
  }
})
</script>
