<template>
  <app-page :title="title">
    <q-card-section class="col relative-position">
      <div class="absolute-full flex flex-center">
        <slot name="question"></slot>
      </div>
    </q-card-section>
    <q-card-section class="text-h6 row no-wrap q-pa-none bg-pink">
      <template v-if="revealed">
        <card-button square class="col-6 bg-red q-pa-md" @click="grade(false)">
          I didn't know
        </card-button>
        <card-button square class="col-6 bg-green q-pa-md" @click="grade(true)">I knew</card-button>
      </template>
      <card-button v-else square class="col-12 bg-blue q-pa-md" @click="reveal()">
        Reveal the Answer
      </card-button>
    </q-card-section>
    <q-card-section class="col relative-position">
      <div class="absolute-full flex flex-center">
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
    modelValue: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'grade'],
  computed: {
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
    }
  }
})
</script>
