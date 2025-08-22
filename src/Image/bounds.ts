import { Rectangle } from "../interfaces/search";

/**
 * Calculate the bounds of an image element in the viewport
 */
export const calculateImageBounds = (
  imageElement: HTMLImageElement | null | undefined,
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
