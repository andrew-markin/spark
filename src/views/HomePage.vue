<template>
  <scrollable-page title="Spark">
    <course-button v-for="course of courses" :key="course.name" :course="course" />
    <menu-button :to="{ name: 'settings' }" class="q-mt-xl">Settings</menu-button>
    <menu-button :to="{ name: 'about' }">About</menu-button>
  </scrollable-page>
</template>

<script>
import { defineComponent } from 'vue'

import CourseButton from '@/components/CourseButton.vue'
import MenuButton from '@/components/MenuButton.vue'
import ScrollablePage from '@/components/ScrollablePage.vue'

export default defineComponent({
  components: {
    CourseButton,
    MenuButton,
    ScrollablePage
  },
  computed: {
    courses() {
      return [
        { title: 'Country - Capital', name: 'country-capital' },
        { title: 'Capital - Country', name: 'capital-country' },
        { title: 'Flag - Country', name: 'flag-country' },
        { title: 'Country - Flag', name: 'country-flag' }
      ]
    }
  }
})
</script>
