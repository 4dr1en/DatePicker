import { ref, type Ref } from "vue"

export function useMonthGrid(
	monthSelector: Ref<HTMLElement | null>,
	initialMonth: number,
) {
	const activeMonth = ref(initialMonth)

	function selectNextMonth() {
		selectMonth((activeMonth.value % 12) + 1)
	}
	function selectPreviousMonth() {
		selectMonth((activeMonth.value - 2 + 12) % 12 + 1)
	}

	function selectMonth(month: number) {
		activeMonth.value = month
		selectActiveMonth()
	}

	function selectActiveMonth() {
		monthSelector.value
			?.querySelector<HTMLElement>(`#month-${activeMonth.value}`)
			?.focus()
	}

	return {
		activeMonth,
		selectMonth,
		selectNextMonth,
		selectPreviousMonth,
	}
}