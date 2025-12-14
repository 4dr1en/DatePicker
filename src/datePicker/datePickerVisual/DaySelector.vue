<script setup lang="ts">
import { computed } from 'vue'
import DayCard from './DayCard.vue'
import { useDaysOfMonth } from './useDaysOfMonth';
import { useDaysGrid } from './useDaysGrid';

const props = defineProps<{
  visibleMonth: number
  visibleYear: number
  selected?: Date
}>()

const emits = defineEmits<{
  (event: 'model:selected', value: Date): void
  (event: 'update:visibleMonth', value: number): void
  (event: 'update:visibleYear', value: number): void
}>()

const headerDays = computed(() => {
  const formatter = new Intl.DateTimeFormat(navigator.language, { weekday: 'long' })
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const day = formatter.format(new Date(2024, 0, i + 1)) // January 1, 2024 is a Monday
    days.push(day)
  }
  return days
})

const { weeks } = useDaysOfMonth(
  computed(() => props.visibleMonth),
  computed(() => props.visibleYear),
)

function isSelectedDay(day: Date): boolean {
  return day.toDateString() === props.selected?.toDateString()
}

function selectDay(day: Date) {
  emits('model:selected', day)
}

const {
  isActiveDay,
  selectNextDay,
  selectPreviousDay,
  selectNextWeek,
  selectPreviousWeek,
} = useDaysGrid(
  computed(() => props.selected || null),
  computed(() => props.visibleMonth),
  computed(() => props.visibleYear),
  (month: number) => emits('update:visibleMonth', month),
  (year: number) => emits('update:visibleYear', year),
)

</script>

<template>
  <table class="day-selector">
    <thead>
      <tr class="day-selector__cols" aria-hidden="true">
        <th
          class="day-selector__col"
          v-for="day in headerDays"
          :key="day"
          :aria-label="day"
          scope="col"
        >
          {{ day.charAt(0) }}
        </th>
      </tr>
    </thead>
    <tbody class="day-selector__body" role="grid"
      @keydown.right.prevent="selectNextDay"
      @keydown.left.prevent="selectPreviousDay"
      @keydown.down.prevent="selectNextWeek"
      @keydown.up.prevent="selectPreviousWeek"
    >
      <tr v-for="(week, index) in weeks" :key="index" role="row">
        <td v-for="dayToDisplay in week" :key="dayToDisplay.toDateString()" role="gridcell">
          <DayCard
            :isDisplayedMonth="dayToDisplay.getMonth() + 1 === props.visibleMonth"
            :day="dayToDisplay"
            :selected="isSelectedDay(dayToDisplay)"
            :active="isActiveDay(dayToDisplay)"
            @click="selectDay(dayToDisplay)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.day-selector__body tr,
.day-selector__cols {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 4px;
}

.day-selector__col {
  text-transform: uppercase;
  text-align: center;
  font-weight: bold;
}
</style>
