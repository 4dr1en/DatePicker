<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DaySelector from './DaySelector.vue'
import YearSelector from './YearSelector.vue'
import MonthSelector from './MonthSelector.vue'
import DialogBox from './DialogBox.vue'
import DateNavigation from './DateNavigation.vue'

const props = defineProps<{
  modelValue: Date | undefined
  textFieldRef: HTMLElement | null
}>()

const emits = defineEmits<{
  (event: 'update:modelValue', value: Date): void
}>()

const open = defineModel<boolean>('open')
const visibleMonth = ref()
const visibleYear = ref()
watch(
  () => props.modelValue,
  (newDate) => {
    if (newDate) {
      visibleMonth.value = newDate.getMonth() + 1
      visibleYear.value = newDate.getFullYear()
    } else {
      const today = new Date()
      visibleMonth.value = today.getMonth() + 1
      visibleYear.value = today.getFullYear()
    }
  },
  { immediate: true },
)
const view = ref<'days' | 'months' | 'years'>('days')
watch(open, (isOpen) => {
  if (!isOpen) {
    view.value = 'days'
  }
})

const selectedDate = computed(() => {
  return new Intl.DateTimeFormat(navigator.language || 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(props.modelValue)
})
</script>

<template>
  <DialogBox :parentRef="props.textFieldRef" v-model="open">
    <div class="date-picker-visual">
      <header class="date-picker-visual__selected-date">
        <p>{{ selectedDate }}</p>
      </header>
      <DateNavigation
        v-model:visibleMonth="visibleMonth"
        v-model:visibleYear="visibleYear"
        v-model:view="view"
      />
      <DaySelector
        v-if="view === 'days'"
        :month="visibleMonth"
        :year="visibleYear"
        :selected="modelValue"
        @model:selected="(selected) => emits('update:modelValue', selected)"
      />
      <YearSelector
        v-else-if="view === 'years'"
        :min="1900"
        :max="2100"
        :modelValue="modelValue?.getFullYear()"
        @update:modelValue="
          (year: number) => {
            visibleYear = year
            view = 'months'
          }
        "
      />
      <MonthSelector
        v-else-if="view === 'months'"
        :modelValue="visibleMonth"
        @update:modelValue="
          (month: number) => {
            visibleMonth = month
            view = 'days'
          }
        "
      />
    </div>
  </DialogBox>
</template>

<style lang="scss" scoped>
.date-picker-visual {
  width: 300px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
}

.date-picker-visual__selected-date {
  font-size: 1.4rem;
  color: var(--ldp-interface-color);
  margin: 0;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #ddd;

  & p {
    text-align: center;
    margin: 0;
    text-transform: capitalize;
  }
}
</style>
