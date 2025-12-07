import { nextTick, onMounted, ref, watch, type Ref } from "vue";

export function useDaysGrid(
	selectedDate: Ref<Date | null>,
	visibleMonth: Ref<number>,
	visibleYear: Ref<number>,
	updateMonth: (month: number) => void,
	updateYear: (year: number) => void) {

	onMounted(() => {
		focusActiveDay()
	})

	const activeDay = ref<Date>(initializeActiveDay())

	function initializeActiveDay() {
		const candidateDate = selectedDate.value || new Date()
		return new Date(visibleYear.value, visibleMonth.value - 1, candidateDate.getDate())
	}

	function focusActiveDay() {
		nextTick(() => {
			const activeDayElement = document.querySelector('.day-card--active') as HTMLElement
			activeDayElement?.focus()
		})
	}

	watch(
		selectedDate,
		(newSelected) => {
			if (!newSelected) return
			activeDay.value = newSelected
		},
	)

	/**
	 * When the visible month or year changes, the active day should be updated
	 * to reflect the new month/year while keeping the same date if possible.
	 */
	watch(
		[visibleMonth, visibleYear],
		() => {
			if (visibleYear.value !== activeDay.value.getFullYear() || visibleMonth.value !== activeDay.value.getMonth() + 1) {
				// When changing months, ensure the active day isn't out of range for the new month
				const daysInMonth = new Date(visibleYear.value, visibleMonth.value, 0).getDate()
				const candidateDay = activeDay.value.getDate()
				const selectedDate = candidateDay > daysInMonth ? daysInMonth : candidateDay
				activeDay.value = new Date(visibleYear.value, visibleMonth.value - 1, selectedDate)
				focusActiveDay()
			}
		},
	)

	function isActiveDay(day: Date): boolean {
		return day.toDateString() === activeDay.value?.toDateString()
	}

	function updateGrid() {

		// if the month  has changed, emit the change to update the visible month/year
		if (activeDay.value.getMonth() + 1 !== visibleMonth.value) {
			updateMonth(activeDay.value.getMonth() + 1)
		}

		// if the year has changed, emit the change to update the visible year
		if (activeDay.value.getFullYear() !== visibleYear.value) {
			updateYear(activeDay.value.getFullYear())
		}

		focusActiveDay()
	}

	function selectDay(deplacementDay: number) {
		activeDay.value = new Date(
			activeDay.value.getFullYear(),
			activeDay.value.getMonth(),
			activeDay.value.getDate() + deplacementDay
		)
		updateGrid()
	}

	function selectNextDay() {
		selectDay(1)
	}

	function selectPreviousDay() {
		selectDay(-1)
	}

	function selectNextWeek() {
		selectDay(7)
	}

	function selectPreviousWeek() {
		selectDay(-7)
	}

	return {
		activeDay,
		isActiveDay,
		selectNextDay,
		selectPreviousDay,
		selectNextWeek,
		selectPreviousWeek,
	}
}