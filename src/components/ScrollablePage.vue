<template>
  <app-page>
    <template #corner>
      <slot name="corner" />
    </template>
    <div class="col relative-position">
      <scroll-area class="absolute-full">
        <slot></slot>
      </scroll-area>
    </div>
  </app-page>
</template>

<script>
import { defineComponent } from 'vue'

import AppPage from '@/components/AppPage.vue'
import ScrollArea from '@/components/ScrollArea.vue'

export default defineComponent({
  components: {
    AppPage,
    ScrollArea
  }
})
</script>
