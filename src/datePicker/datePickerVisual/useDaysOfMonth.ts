import { computed, type Ref } from "vue"

/**
 * Gets the weeks to display for a given month and year.
 */
export function useDaysOfMonth(month: Ref<number>, year: Ref<number>) {

	const weeks = computed<Array<Array<Date>>>(() => {
		const days: Array<Date> = []
		const nShowPrevious = (new Date(year.value, month.value - 1, 1).getDay() + 6) % 7
		const daysInMonth = new Date(year.value, month.value, 0).getDate()
		const daysInPrevMonth = new Date(year.value, month.value - 1, 0).getDate()

		const startPrevMonthDay = daysInPrevMonth - (nShowPrevious - 1)
		for (let i = startPrevMonthDay; i <= daysInPrevMonth; i++) {
			days.push(new Date(year.value, month.value - 2, i))
		}
		for (let i = 1; i <= daysInMonth; i++) {
			days.push(new Date(year.value, month.value - 1, i))
		}
		for (let i = 1; days.length % 7 !== 0; i++) {
			days.push(new Date(year.value, month.value, i))
		}

		// Group days into weeks (arrays of 7 days)
		const weeks: Array<Array<Date>> = []
		for (let i = 0; i < days.length; i += 7) {
			weeks.push(days.slice(i, i + 7))
		}

		return weeks
	})

	return {
		weeks
	}
}