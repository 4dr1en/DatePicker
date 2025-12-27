<script setup lang="ts">
import DatePickerInput from './datePickerInput/DatePickerInput.vue'
import DatePickerVisual from './datePickerVisual/DatePickerVisual.vue'
import { inject, ref, watch } from 'vue'
import CalendarIcon from './icons/CalendarIcon.vue'

const internalDate = defineModel<Date>()
const textField = ref<typeof DatePickerInput>()

const props = defineProps<{
  format: string
  placeholder?: string
}>()

const dateSelectorOpen = ref(false)
watch(dateSelectorOpen, (isOpen) => {
  if (!isOpen) {
    textField.value?.$el?.focus()
  }
})

const isError = inject('isError') as boolean
</script>

<template>
  <div>
    <div class="date-picker" :class="{ 'date-picker--error': isError }">
      <DatePickerInput
        ref="textField"
        v-model="internalDate"
        :format="props.format"
        :placeholder="props.placeholder"
      />
      <button
        class="date-picker-open-button"
        aria-label="Ouvrir le sélecteur de date"
        @click="() => (dateSelectorOpen = !dateSelectorOpen)"
      >
        <CalendarIcon fill="var(--ldp-interface-color)" />
      </button>
    </div>
    <DatePickerVisual
      v-model="internalDate"
      v-model:open="dateSelectorOpen"
      :text-field-ref="textField?.$el"
      @update:model-value="dateSelectorOpen = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.date-picker {
  background-color: var(--ldp-background-color);
  border: 1px solid var(--ldp-interface-color);
  border-radius: var(--ldp-radius);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  width: 300px;

  &:has(:focus-visible) {
    border-color: var(--ldp-accent-color);
  }
}
.date-picker--error {
  border-color: var(--ldp-error-color);
}
.date-picker-open-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
</style>
