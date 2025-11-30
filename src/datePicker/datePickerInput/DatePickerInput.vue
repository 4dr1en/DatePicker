<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import { formatDate } from './formatDate'
import { dateFromString, stringFromDate } from './dateConvertion'

const props = defineProps<{
  modelValue: Date | undefined
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: Date): void
}>()

const internalValue = ref('')

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = stringFromDate(newValue)
  },
  { immediate: true },
)

function handleInput(event: InputEvent | FocusEvent) {
  const target = event.target as HTMLInputElement
  let currentCursorPos = target.selectionStart || 0

  // When deleting, just update the internal value to prevent formatting issues
  if (target.value.length < internalValue.value.length) {
    internalValue.value = target.value
    return
  }

  const newValue = formatDate(target.value)
  internalValue.value = newValue
  target.value = internalValue.value

  // Handle cursor position
  if (newValue.charAt(currentCursorPos - 1) === '/' && 'data' in event && event.data !== '/') {
    currentCursorPos++
  }
  target.selectionStart = currentCursorPos
  target.selectionEnd = currentCursorPos

  // Update modelValue if we have a complete date
  if (newValue.length === 10) {
    const newDate = dateFromString(newValue)
    if (newDate) {
      emits('update:modelValue', newDate)
    } else {
      // Invalid date string
      console.warn('Invalid date string:', newValue)
    }
  }
}

const id = inject('id') as string
const isError = inject('isError') as boolean
</script>

<template>
  <input
    :id="`date-picker-${id}`"
    type="text"
    inputmode="numeric"
    class="date-picker-input"
    @input.passive="handleInput"
    @blur="handleInput"
    :value="internalValue"
    :aria-describedby="`date-picker-${id}__hint date-picker-${id}__error`"
    :aria-invalid="isError"
  />
</template>

<style lang="scss" scoped>
.date-picker-input {
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 4px 16px 4px 8px;
  background: transparent;
}
</style>
