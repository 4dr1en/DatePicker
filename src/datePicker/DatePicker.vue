<script setup lang="ts">
import { computed, provide, useId } from 'vue'
import DatePickerCombined from './DatePickerCombined.vue'

const id = useId()

const modelValue = defineModel<Date | undefined>()

const props = defineProps<{
  label?: string
  hint?: string
  error?: string
}>()

const isError = computed(() => {
  return !!props.error
})

provide('id', id)
provide('isError', isError)
</script>

<template>
  <div class="date-picker">
    <label :for="`date-picker-${id}`">{{ props.label }}</label>
    <p v-if="props.hint" class="date-picker__hint" :id="`date-picker-${id}__hint`">
      {{ props.hint }}
    </p>
    <DatePickerCombined v-model="modelValue" />
    <p v-if="props.error" class="date-picker__error" :id="`date-picker-${id}__error`">
      {{ props.error }}
    </p>
  </div>
</template>

<style>
:root {
  --ldp-interface-color: #84878e;
  --ldp-accent-color: #2684ff;
  --ldp-active-color: #007bff;
  --ldp-active-color-focus: #0056b3;
  --ldp-background-color: #ffffff;
  --ldp-error-color: #d41518;
  --ldp-radius: 4px;
  --ldp-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05);
}
</style>

<style lang="scss" scoped>
.date-picker {
  font-family: sans-serif;
}

.date-picker__hint {
  font-size: 0.875rem;
  color: var(--ldp-interface-color);
  margin: 2px 0 2px 0;
}

.date-picker__error {
  font-size: 0.875rem;
  color: var(--ldp-error-color);
  margin: 2px 0 0 0;
}
</style>
