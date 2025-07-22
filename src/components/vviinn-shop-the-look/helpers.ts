import { Rectangle } from "../../interfaces/search";
import { fromImage } from "../../geometry/Rectangle";

export interface ModalPosition {
  x: number;
  y: number;
}

export const calculateModalPosition = (
  detectedObject: Rectangle,
  imageElement: HTMLImageElement,
  width: number,
  height: number
): ModalPosition => {
  if (!imageElement) return { x: 0, y: 0 };

  const imageRect = imageElement.getBoundingClientRect();
  const objectCenterX = detectedObject.left + detectedObject.width / 2;
  const objectCenterY = detectedObject.top + detectedObject.height / 2;
  const pixelX = objectCenterX * width;
  const pixelY = objectCenterY * height;
  const modalDistance = detectedObject.width * width;

  return {
    x: imageRect.left + pixelX - modalDistance,
    y: imageRect.top + pixelY,
  };
};

export const calculateImageBounds = (imageElement: HTMLImageElement): Rectangle | null => {
  if (!imageElement) return null;
  return fromImage(imageElement);
};

export const hasImageBoundsChanged = (
  currentBounds: Rectangle | null,
  newBounds: Rectangle
): boolean => {
  if (!currentBounds) return true;
  
  return (
    currentBounds.left !== newBounds.left ||
    currentBounds.top !== newBounds.top ||
    currentBounds.width !== newBounds.width ||
    currentBounds.height !== newBounds.height
  );
};

export const createImageFile = async (imageUrl: string): Promise<File> => {
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();
  return new File([imageBlob], "shop-the-look-image.jpg", {
    type: "image/jpeg",
  });
};

export const resetSearchState = () => ({
  detectedObjects: [],
  searchResults: [],
  showModal: false,
  selectedDetectedObject: null,
  modalPosition: null,
  initialSearchCompleted: false,
});