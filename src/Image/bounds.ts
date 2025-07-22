import { Rectangle } from "../interfaces/search";

/**
 * Calculate the bounds of an image element in the viewport
 */
export const calculateImageBounds = (
  imageElement: HTMLImageElement,
): Rectangle | null => {
  if (!imageElement) return null;
  const rect = imageElement.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
};

/**
 * Check if image bounds have changed
 */
export const hasImageBoundsChanged = (
  currentBounds: Rectangle | null,
  newBounds: Rectangle,
): boolean => {
  if (!currentBounds) return true;

  return (
    currentBounds.left !== newBounds.left ||
    currentBounds.top !== newBounds.top ||
    currentBounds.width !== newBounds.width ||
    currentBounds.height !== newBounds.height
  );
};