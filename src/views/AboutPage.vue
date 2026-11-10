<template>
  <scrollable-page :title="$t('ABOUT')">
    <q-img
      src="favicon.svg"
      height="12rem"
      fit="contain"
      class="q-mt-md"
      loading="eager"
      no-spinner
      no-transition
    />
    <div class="text-secondary text-center q-mt-md q-mb-lg">
      <div class="text-h5">{{ $t('_APP_TITLE') }}</div>
      <div class="text-subtitle1">{{ $t('APP_VERSION', { number: version }) }}</div>
    </div>
    <menu-button :icon="fabGithub" :href="github">
      {{ $t('GITHUB_REPOSITORY') }}
    </menu-button>
    <menu-button :icon="fabLinkedin" :href="linkedin">
      {{ $t('LINKEDIN_PROFILE') }}
    </menu-button>
  </scrollable-page>
</template>

<script setup>
import { fabGithub, fabLinkedin } from '@quasar/extras/fontawesome-v7'

import MenuButton from '@/components/MenuButton.vue'
import ScrollablePage from '@/components/ScrollablePage.vue'
import { github, linkedin, version } from '@/consts'
</script>
