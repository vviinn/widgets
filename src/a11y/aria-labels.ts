import i18next from "i18next";

/**
 * Generates an appropriate aria-label for a filter remove button
 * @param label - The filter label
 * @returns The aria-label string
 */
export function getRemoveFilterAriaLabel(label: string): string {
  return i18next.t("filters.a11y.removeFilterLabel", { label });
}

/**
 * Generates an aria-label for color option filters
 * @param label - The color label
 * @returns The aria-label string
 */
export function getColorOptionAriaLabel(label: string): string {
  return i18next.t("filters.a11y.colorOption", { label });
}
