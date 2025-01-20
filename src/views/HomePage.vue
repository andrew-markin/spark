<template>
  <app-page title="Spark">
    <div class="col relative-position">
      <q-scroll-area class="absolute-full" :thumb-style="thumbStyle">
        <q-list>
          <q-item
            v-for="course of courses"
            :key="course.route"
            v-ripple
            clickable
            :to="{ name: course.route }"
          >
            <q-item-section class="text-subtitle1 q-py-md">
              {{ course.title }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>
  </app-page>
</template>

<script>
import { colors } from 'quasar'
import { defineComponent } from 'vue'

import AppPage from '@/components/AppPage.vue'

export default defineComponent({
  components: {
    AppPage
  },
  computed: {
    thumbStyle() {
      return {
        borderRadius: '0px',
        backgroundColor: colors.getPaletteColor('primary'),
        width: '5px',
        opacity: '0.75'
      }
    },
    courses() {
      return [
        { title: 'Country - Capital', route: 'country-capital' },
        { title: 'Capital - Country', route: 'capital-country' },
        { title: 'Flag - Country', route: 'flag-country' },
        { title: 'Country - Flag', route: 'country-flag' }
      ]
    }
  }
})
</script>
