<script setup lang="ts">
const props = defineProps<{
  modelValue: number
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

function getMonthName(monthIndex: number): string {
  return Intl.DateTimeFormat(navigator.language || 'fr-FR', { month: 'long' }).format(
    new Date(0, monthIndex - 1),
  )
}
</script>

<template>
  <div class="month-selector">
    <button
      v-for="monthIndex in 12"
      :key="monthIndex"
      class="month-selector__month"
      :class="{ 'month-selector__month--selected': monthIndex === props.modelValue }"
      @click="() => emits('update:modelValue', monthIndex)"
    >
      {{ getMonthName(monthIndex) }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.month-selector {
  max-height: 400px;
  width: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(33%, 150px), 1fr));
}

.month-selector__month {
  padding: 8px;
  margin: 4px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-align: center;
  min-width: 33px;
  border-radius: 99px;

  &:hover {
    background-color: #d0d0d0;
  }
}

.month-selector__month--selected {
  background-color: var(--ldp-active-color);
  color: white;

  &:hover {
    background-color: var(--ldp-active-color-focus);
  }
}
</style>
