<template>
  <app-page :title="title">
    <template #corner>
      <div class="text-h6 non-selectable cursor-pointer" @click="drop()">{{ scoreLabel }}%</div>
    </template>
    <q-card-section class="col relative-position">
      <div class="absolute-full flex flex-center q-pa-sm">
        <slot name="question"></slot>
      </div>
    </q-card-section>
    <q-card-section class="text-h6 row no-wrap q-pa-none text-center">
      <template v-if="revealed">
        <card-button square class="col-6 bg-negative q-pa-md" @click="grade(false)">
          {{ $t('ANSWER_GRADE_SUCCESS') }}
        </card-button>
        <card-button square class="col-6 bg-positive q-pa-md" @click="grade(true)">
          {{ $t('ANSWER_GRADE_FAIL') }}
        </card-button>
      </template>
      <card-button v-else square class="col-12 bg-primary q-pa-md" @click="reveal()">
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
import { defineComponent } from 'vue'

import AppPage from './AppPage.vue'
import CardButton from './CardButton.vue'

export default defineComponent({
  components: {
    AppPage,
    CardButton
  },
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
  methods: {
    reveal() {
      this.revealed = true
    },
    grade(success) {
      this.$emit('grade', success)
    },
    drop() {
      this.$emit('drop')
    }
  }
})
</script>
