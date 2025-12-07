<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  day: Date
  selected?: boolean
  active?: boolean
  isDisplayedMonth: boolean
}>()

const emits = defineEmits<{
  (event: 'click', value: Date): void
}>()

const longDate = computed(() => {
  return Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(props.day)
})
</script>

<template>
  <button
    class="day-card"
    :class="{
      'day-card--selected': props.selected,
      'day-card--active': props.active,
      'day-card--fade': !props.isDisplayedMonth,
    }"
    @click="() => emits('click', props.day)"
    :aria-label="longDate"
    :tabindex="props.active ? '0' : '-1'"
  >
    {{ props.day.getDate() }}
  </button>
</template>

<style lang="scss" scoped>
.day-card {
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  cursor: pointer;
  background-color: transparent;
  border-radius: 99px;
  transition:
    background-color 0.1s ease-in-out,
    color 0.1s ease-in-out;

  &:hover {
    background-color: #d0d0d0;
    color: black;
  }

  &:focus {
    outline: 2px solid var(--ldp-accent-color);
    outline-offset: 2px;
  }
}

.day-card--fade {
  color: #747474;
}

.day-card--selected {
  background-color: var(--ldp-active-color);
  color: white;

  &:hover {
    color: white;
    background-color: var(--ldp-active-color-focus);
  }
}
</style>
