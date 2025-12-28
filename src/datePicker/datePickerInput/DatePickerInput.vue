<script setup lang="ts">
import { computed, inject, useTemplateRef, watch } from 'vue';
import { formatDate, parseDate } from './dateConvertion';
import { useMask } from './useMask';

const props = defineProps<{
  modelValue: Date | undefined
  format: string
  placeholder?: string
}>()
const mask = computed(()=> props.format.replace(/(DD|MM|YY)/g, '##'));
const emits = defineEmits<{
  (event: 'update:modelValue', value: Date): void
}>()

const inputField = useTemplateRef<HTMLInputElement>('inputField');
const { model, applyMask } = useMask(inputField, mask);

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    model.value = '';
    return;
  }
  const formatedDate = formatDate(newValue, props.format);
  const { maskedValue } = applyMask(formatedDate);
  if (maskedValue !== model.value) {
    model.value = maskedValue;
  }
}, { immediate: true });

watch(model, (newValue) => {
  if (newValue.length < mask.value.length) {
    return;
  }
  const date = parseDate(newValue, props.format);

  if (
    date && date.getTime() !== props.modelValue?.getTime()
  ) emits('update:modelValue', date);
});

const id = inject('id') as string;
const isError = inject('isError') as boolean;
</script>

<template>
  <input
    ref="inputField"
    :id="`date-picker-${id}`"
    type="text"
    inputmode="numeric"
    class="date-picker-input"
    :value="model"
    :aria-describedby="`date-picker-${id}__hint date-picker-${id}__error`"
    :aria-invalid="isError"
    :placeholder="props.placeholder"
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
