import { nextTick, watch, type Ref } from "vue";

export function useFocusTrap(
  open: Ref<boolean>,
  containerRef: Ref<HTMLElement | null>
) {
  function handleFocus(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    if (!open.value || !containerRef.value) return;

    const focusableElements = containerRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]):not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0]!;
    const lastElement = focusableElements[focusableElements.length - 1]!;

    if (event.target === lastElement && !event.shiftKey) {
      event.preventDefault();
      firstElement.focus();
    } else if (event.target === firstElement && event.shiftKey) {
      event.preventDefault();
      lastElement.focus();
    }
  }

  watch(open, async (isOpen) => {
    if (isOpen) {
      await nextTick();
      containerRef.value!.addEventListener("keydown", handleFocus);
    } else {
      containerRef.value!.removeEventListener("keydown", handleFocus);
    }
  });
}