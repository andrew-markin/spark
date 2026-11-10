<template>
  <app-page :title="title">
    <template #corner>
      <div
        v-touch-hold:1000.mouse="drop"
        class="text-h6 non-selectable cursor-pointer"
        :title="$t('HOLD_TO_RESET')"
      >
        {{ scoreLabel }}
      </div>
    </template>
    <q-card-section class="col relative-position">
      <div class="absolute-full flex flex-center q-pa-sm">
        <slot name="question"></slot>
      </div>
    </q-card-section>
    <q-card-section class="text-h6 row no-wrap q-pa-none text-center">
      <template v-if="revealed">
        <card-button square class="col-6 bg-negative text-uppercase q-pa-md" @click="grade(false)">
          {{ $t('ANSWER_DIDNT_KNOW') }}
        </card-button>
        <card-button square class="col-6 bg-positive text-uppercase q-pa-md" @click="grade(true)">
          {{ $t('ANSWER_KNEW') }}
        </card-button>
      </template>
      <card-button v-else square class="col-12 bg-primary text-uppercase q-pa-md" @click="reveal()">
        {{ $t('ANSWER_REVEAL') }}
      </card-button>
    </q-card-section>
    <q-card-section class="col relative-position">
      <div class="absolute-full flex flex-center q-pa-sm">
        <slot v-if="revealed" name="answer"></slot>
        <div v-else class="text-h4 text-primary text-center">???</div>
      </div>
    </q-card-section>
  </app-page>
</template>

<script setup>
import { useI18n } from 'petite-vue-i18n'
import { debounce } from 'quasar'
import { computed, onMounted, onUnmounted } from 'vue'

import { formatPercent } from '@/i18n'

import AppPage from './AppPage.vue'
import CardButton from './CardButton.vue'

const props = defineProps({
  title: { type: String, default: undefined },
  score: { type: Number, default: 0 }
})
const revealed = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['grade', 'drop'])

const { locale } = useI18n()
const scoreLabel = computed(() => formatPercent(props.score, locale.value))

// Act immediately, but ignore any further action until taps settle down, so a double tap
// on "Reveal the Answer" doesn't also grade the answer, as the grading buttons take its place
const act = debounce((action) => action(), 300, true)

function reveal() {
  act(() => {
    revealed.value = true
  })
}

function grade(success) {
  act(() => emit('grade', success))
}

// All the progress of the course is lost, so on a long press only, not on a stray tap
function drop() {
  emit('drop')
}

// Space or Enter reveals the answer, the arrows point at the grading buttons
function onKeydown(event) {
  if (event.repeat || event.ctrlKey || event.altKey || event.metaKey) return
  if (!revealed.value && [' ', 'Enter'].includes(event.key)) reveal()
  else if (revealed.value && event.key === 'ArrowLeft') grade(false)
  else if (revealed.value && event.key === 'ArrowRight') grade(true)
  else return
  event.preventDefault()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>
