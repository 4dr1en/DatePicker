<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  min: number
  max: number
  modelValue: number | undefined
}>()

const yearSelector = ref<HTMLElement | null>(null)

const emits = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

onMounted(() => {
  yearSelector.value
    ?.querySelector<HTMLElement>(`#year-${props.modelValue}`)
    ?.scrollIntoView({ block: 'center' })
})
</script>

<template>
  <div class="year-selector" ref="yearSelector">
    <button
      v-for="year of Array.from({ length: props.max - props.min + 1 }, (_, i) => props.min + i)"
      :key="year"
      :id="`year-${year}`"
      class="year-selector__year"
      :class="{ 'year-selector__year--selected': year === props.modelValue }"
      @click="() => emits('update:modelValue', year)"
    >
      {{ year }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.year-selector {
  max-height: 400px;
  width: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(max(33%, 100px), 1fr));
}

.year-selector__year {
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

  &--selected {
    background-color: var(--ldp-active-color);
    color: white;
    &:hover {
      background-color: var(--ldp-active-color-focus);
    }
  }
}
</style>
