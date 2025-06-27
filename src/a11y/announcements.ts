/**
 * Announces a message to screen readers via a live region
 * @param element - The aria-live element reference
 * @param message - The message to announce
 */
export function announceToScreenReader(
  message: string,
  element?: HTMLElement,
): void {
  if (element) {
    element.textContent = message;
  }
}
