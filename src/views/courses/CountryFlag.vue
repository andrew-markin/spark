<template>
  <country-course-page course="country-flag" title="Country - Flag">
    <template #question="{ option }">
      <div class="text-h4 text-primary text-center">
        {{ option.name[locale] }}
      </div>
    </template>
    <template #answer="{ option }">
      <img :src="`/flags/${option.code}.svg`" class="flag" />
    </template>
  </country-course-page>
</template>

<script>
import { mapState } from 'pinia'
import { defineComponent } from 'vue'

import CountryCoursePage from '@/components/CountryCoursePage.vue'
import { useMainStore } from '@/stores/main'

export default defineComponent({
  components: {
    CountryCoursePage
  },
  computed: {
    ...mapState(useMainStore, ['locale'])
  }
})
</script>

<style scoped lang="scss">
.flag {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  border: 3px solid $grey-8;
  padding: 2px;
}
</style>
