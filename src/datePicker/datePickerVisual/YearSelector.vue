<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useYearGrid } from './useYearGrid';

const props = defineProps<{
  min: number
  max: number
  modelValue?: number
}>()

const yearSelector = ref<HTMLElement | null>(null)

const emits = defineEmits<{
  (event: 'update:modelValue', value: number): void
}>()

const {
  activeYear,
  selectNextYear,
  selectPreviousYear,
  selectNextRow,
  selectPreviousRow,
} = useYearGrid(
  yearSelector,
  computed(() => props.min),
  computed(() => props.max),
  props.modelValue,
)

onMounted(() => {
  yearSelector.value!.querySelector<HTMLElement>(`#year-${activeYear.value}`)!.focus();
})

</script>

<template>
  <div
    class="year-selector"
    ref="yearSelector"
    role="grid"
    @keydown.left.prevent="selectPreviousYear"
    @keydown.right.prevent="selectNextYear"
    @keydown.up.prevent="selectPreviousRow"
    @keydown.down.prevent="selectNextRow"
  >
    <button
      v-for="year of Array.from({ length: props.max - props.min + 1 }, (_, i) => props.min + i)"
      :key="year"
      :id="`year-${year}`"
      :tabindex="year === activeYear ? 0 : -1"
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
