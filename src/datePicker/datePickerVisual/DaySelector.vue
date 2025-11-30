<script setup lang="ts">
import { computed } from 'vue'
import DayCard from './DayCard.vue'

const props = defineProps<{
  month: number
  year: number
  selected?: Date
}>()

const emits = defineEmits<{
  (event: 'model:selected', value: Date): void
}>()

const daysInMonth = computed(() => {
  return new Date(props.year, props.month, 0).getDate()
})

const daysInPrevMonth = computed(() => {
  return new Date(props.year, props.month - 1, 0).getDate()
})

const daysToDisplay = computed<Array<Date>>(() => {
  const days: Array<Date> = []
  const nShowPrevious = (new Date(props.year, props.month - 1, 1).getDay() + 6) % 7

  const startPrevMonthDay = daysInPrevMonth.value - (nShowPrevious - 1)
  for (let i = startPrevMonthDay; i <= daysInPrevMonth.value; i++) {
    days.push(new Date(props.year, props.month - 2, i))
  }
  for (let i = 1; i <= daysInMonth.value; i++) {
    days.push(new Date(props.year, props.month - 1, i))
  }
  for (let i = 1; days.length % 7 !== 0; i++) {
    days.push(new Date(props.year, props.month, i))
  }

  return days
})

function isSelectedDay(day: Date): boolean {
  return day.toDateString() === props.selected?.toDateString()
}

function selectDay(day: Date) {
  emits('model:selected', day)
}

const headerDays = computed(() => {
  const formatter = new Intl.DateTimeFormat(navigator.language, { weekday: 'narrow' })
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const day = formatter.format(new Date(2024, 0, i + 1)) // January 1, 2024 is a Monday
    days.push(day)
  }
  return days
})
</script>

<template>
  <div class="day-selector">
    <div class="day-selector__cols" aria-hidden="true">
      <div class="day-selector__col" v-for="day in headerDays" :key="day">
        {{ day }}
      </div>
    </div>
    <div class="day-selector__body">
      <DayCard
        v-for="dayToDispay in daysToDisplay"
        :isDisplayedMonth="dayToDispay.getMonth() + 1 === props.month"
        :key="dayToDispay.toDateString()"
        :day="dayToDispay"
        :selected="isSelectedDay(dayToDispay)"
        @click="selectDay(dayToDispay)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.day-selector__body,
.day-selector__cols {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 4px;
}

.day-selector__col {
  text-align: center;
  font-weight: bold;
}
</style>
