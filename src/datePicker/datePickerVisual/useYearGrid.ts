import { ref, type Ref } from "vue";

export function useYearGrid(
	yearSelector: Ref<HTMLElement | null>,
	minYear: Ref<number>,
	maxYear: Ref<number>,
	initialYear?: number,
) {
	const yearsPerRow = 3;
	const activeYear = ref(initialYear || (new Date()).getFullYear());
	function selectNextYear() {
		selectYear(activeYear.value! + 1);
	}
	function selectPreviousYear() {
		selectYear(activeYear.value! - 1);
	}
	function selectNextRow() {
		selectYear(activeYear.value! + yearsPerRow);
	}
	function selectPreviousRow() {
		selectYear(activeYear.value! - yearsPerRow);
	}

	function selectYear(year: number) {
		activeYear.value = Math.min(Math.max(year, minYear.value), maxYear.value);
		focusActiveYear();
	}

	function focusActiveYear() {
		yearSelector.value
			?.querySelector<HTMLElement>(`#year-${activeYear.value}`)
			?.focus();
	}

	return {
		activeYear,
		selectNextYear,
		selectPreviousYear,
		selectNextRow,
		selectPreviousRow,
	};
}