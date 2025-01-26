import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsPage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutPage.vue')
    },
    {
      path: '/country-capital',
      name: 'country-capital',
      component: () => import('@/views/courses/CountryCapital.vue')
    },
    {
      path: '/capital-country',
      name: 'capital-country',
      component: () => import('@/views/courses/CapitalCountry.vue')
    },
    {
      path: '/flag-country',
      name: 'flag-country',
      component: () => import('@/views/courses/FlagCountry.vue')
    },
    {
      path: '/country-flag',
      name: 'country-flag',
      component: () => import('@/views/courses/CountryFlag.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' }
    }
  ]
})

export default router
