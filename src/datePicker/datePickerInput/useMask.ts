import { computed, onMounted, ref, toValue, type MaybeRef, type Ref } from "vue";

/**
 * Applys a mask to an input field.
 */
export function useMask(inputField: Readonly<Ref<HTMLInputElement | null>>, mask: MaybeRef<string>) {
	const cleanMask = computed<Array<string | RegExp>>(
		() => toValue(mask).split('').map((char) =>
			char === '#' ? /\d/ : char === '*' ? /./ : char
		));

	const model = ref(
		applyMask(inputField.value?.value || '').maskedValue
	);
	
	/** The cursor position before the user input */
	let cursorBeforeInput = 0;


	onMounted(() => {
		cursorBeforeInput = inputField.value?.selectionStart || 0;
	});
	
	function handleKeyDown(e: KeyboardEvent) {
		cursorBeforeInput = (e.target as HTMLInputElement).selectionStart || 0;
	}

	onMounted(() => {
		// add the event listener
		inputField.value!.addEventListener('input', handleInput);
		inputField.value!.addEventListener('keydown', handleKeyDown);
	});

	function handleInput(e: Event) {
		const oldValue = model.value;
		const cursorBeforeMask = (e.target as HTMLInputElement).selectionStart || 0;
		const input = e.target as HTMLInputElement;

		const { maskedValue, caractersAddedBeforeCursor } = applyMask(input.value);

		// Always update the input's value to ensure it shows the correct masked value
		// This is important when the mask filters out characters but model.value doesn't change
		input.value = maskedValue;
		model.value = maskedValue;

		setCursorPosition((e as InputEvent), oldValue, cursorBeforeMask, caractersAddedBeforeCursor);
	};


	function applyMask(input: string) {
		let maskedValue = '';
		let maskIndex = 0;
		let inputIndex = 0;
		let caractersAddedBeforeCursor = 0;

		/** Check if we have processed the entire mask */
		function isMaskComplete() {
			return maskIndex >= cleanMask.value.length;
		}

		/** Check if we have processed the entire input */
		function isInputProcessed() {
			return inputIndex >= input.length;
		}

		while (!isMaskComplete() && !isInputProcessed()) {
			const maskChar = cleanMask.value[maskIndex];
			const currentCursorPos = inputField.value?.selectionStart || 0;

			if (typeof maskChar === 'string') {
				if (maskChar === input[inputIndex]) {
					maskedValue += maskChar;
					maskIndex++;
				} else { // Insert the literal from the mask
					maskedValue += maskChar;
					maskIndex++;
					if (maskIndex <= currentCursorPos) {
						caractersAddedBeforeCursor++;
					}
					continue; // Skip incrementing inputIndex to reprocess the same input character
				}
			}
			else if (maskChar instanceof RegExp) {
				if (maskChar.test(input[inputIndex]!)) {
					maskedValue += input[inputIndex];
					maskIndex++;
				} else { // The value doesn't match the mask
					if (inputIndex <= cursorBeforeInput) {
						caractersAddedBeforeCursor--;
					}
					// maskIndex stays the same to reprocess the same mask character
				}
			}

			inputIndex++;
		}

		return { maskedValue, caractersAddedBeforeCursor };
	};

	function setCursorPosition(
		e: InputEvent,
		oldValue: string,
		oldCursorPosition: number,
		/* Caracters added by the mask before the cursor */
		caractersAddedBeforeCursor: number,
	) {
		const input = e.target as HTMLInputElement;
		const newMaskedValue = input.value;
		if (newMaskedValue.length < oldValue.length) {
			input.setSelectionRange(oldCursorPosition, oldCursorPosition);
		} else if (newMaskedValue.length > oldValue.length) {
			const newCursorPosition = Math.max(0, oldCursorPosition + caractersAddedBeforeCursor);
			input.setSelectionRange(newCursorPosition, newCursorPosition);
		} else {
			// After masking, the length remains the same
			if (e.inputType === 'deleteContentBackward') {
				// deletion on a literal character
				input.setSelectionRange(oldCursorPosition, oldCursorPosition);
				return;
			}
			if (e.inputType === 'deleteContentForward') {
				// deletion on a literal character (forward)
				input.setSelectionRange(oldCursorPosition + 1, oldCursorPosition + 1);
				return;
			}

			// After masking, length unchanged
			const adjustedPosition = oldCursorPosition + caractersAddedBeforeCursor;
			input.setSelectionRange(adjustedPosition, adjustedPosition);
		}
	}

	return { model, applyMask };
}