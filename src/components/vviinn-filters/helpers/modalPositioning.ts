// Checks if a category element is positioned on the right side of the viewport

export const isCategoryOnRightSide = (
  categoryElement: HTMLElement,
): boolean => {
  const rect = categoryElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const categoryCenter = rect.left + rect.width / 2;
  return categoryCenter > viewportWidth / 2;
};

export const applyRightAlignmentToModal = (
  categoryElement: HTMLElement,
): void => {
  const wrapper = categoryElement.querySelector(
    ".filters-modal-main-button-wrapper",
  );

  if (wrapper) {
    wrapper.classList.remove("align-right");
    if (isCategoryOnRightSide(categoryElement)) {
      wrapper.classList.add("align-right");
    }
  }
};
