import { onMounted, onUnmounted, ref, watch, type Ref } from "vue"

/**
 * Datepicker positioning helper.
 *
 * Always positions the datepicker below the field.
 * Applies a vertical correction only when it overflows the viewport.
 */
export function useDialogPosition(
	open: Ref<boolean>,
	targetElement: Ref<HTMLElement | null>,
	positionableElement: Ref<HTMLElement | null>
) {
	function setDialogPosition() {
		if (!targetElement.value) {
			return
		}
		const rectParent = targetElement.value.getBoundingClientRect()
		const rectDialog = positionableElement.value?.getBoundingClientRect()
		const offset = 8

		const spaceBelow = window.innerHeight - rectParent.bottom - (rectDialog?.height || 400)
		const spaceAbove = rectParent.top + rectParent.height

		let overflowAdjustment = 0
		if (spaceBelow < 0) {
			overflowAdjustment = Math.min(Math.abs(spaceBelow), spaceAbove)
		}

		dialogPosition.value = {
			top: `${rectParent.bottom + offset - overflowAdjustment}px`,
			left: `${rectParent.left + window.scrollX}px`,
			minWidth: `${rectParent.width}px`,
		}
	}

	const dialogPosition = ref()

	watch(open, (newVal) => {
		if (newVal) {
			setDialogPosition()
		}
	})

	onMounted(() => {
		window.addEventListener('scroll', setDialogPosition, { passive: true })
		window.addEventListener('resize', setDialogPosition, { passive: true })
	})

	onUnmounted(() => {
		window.removeEventListener('scroll', setDialogPosition)
		window.removeEventListener('resize', setDialogPosition)
	})

	return {
		dialogPosition,
	}
}