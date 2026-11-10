<template>
  <app-page :title="title">
    <template #corner>
      <div
        v-touch-hold:1000.mouse="drop"
        class="text-h6 non-selectable cursor-pointer"
        :title="$t('HOLD_TO_RESET')"
      >
        {{ scoreLabel }}%
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

<script>
import { debounce } from 'quasar'
import { defineComponent } from 'vue'

import AppPage from './AppPage.vue'
import CardButton from './CardButton.vue'

export default defineComponent({
  components: { AppPage, CardButton },
  props: {
    title: { type: String, default: undefined },
    score: { type: Number, default: 0 },
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'grade', 'drop'],
  computed: {
    scoreLabel() {
      return Number(this.score || 0).toFixed(2)
    },
    revealed: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  created() {
    // Act immediately, but ignore any further action until taps settle down, so a double tap
    // on "Reveal the Answer" doesn't also grade the answer, as the grading buttons take its place
    this.act = debounce((action) => action(), 300, true)
  },
  methods: {
    reveal() {
      this.act(() => {
        this.revealed = true
      })
    },
    grade(success) {
      this.act(() => this.$emit('grade', success))
    },
    // All the progress of the course is lost, so on a long press only, not on a stray tap
    drop() {
      this.$emit('drop')
    }
  }
})
</script>
