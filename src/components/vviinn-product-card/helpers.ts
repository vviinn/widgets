import { ProductImage } from "../../interfaces";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";

export const HOVER_DELAY_MS = 65;

/**
 * Brand and non-empty custom labels as host attributes, so a stylesheet loaded
 * through css-url can select cards by product data, e.g. [data-custom-label-1="Bestseller"]
 */
export const getProductDataAttributes = (
  brand: string | undefined,
  customLabels: string[],
): Record<string, string> => ({
  ...addIfNotEmpty("data-brand", brand),
  ...Object.fromEntries(
    customLabels
      .map((label, index) => [`data-custom-label-${index}`, label])
      .filter(([, label]) => label),
  ),
});

export const shouldShowMultipleImages = (
  showMultipleImages: boolean,
  imagesLength: number,
): boolean => showMultipleImages && imagesLength >= 2;

const isFirstImageMatchingMain = (
  mainImage: string | undefined,
  images: ProductImage[],
): boolean => {
  if (!mainImage || images.length === 0) return false;
  const firstImg = images[0];
  const firstImgUrl = firstImg?.thumbnail ?? firstImg?.original;
  return firstImgUrl === mainImage;
};

/**
 * Get the image URL to display based on hover state
 * If hovering and second image should be shown, returns the appropriate hover image
 * Otherwise returns the main image
 */
export const getCurrentImage = (
  showSecondImage: boolean,
  mainImage: string | undefined,
  images: ProductImage[],
  shouldShow: boolean,
): string | undefined => {
  if (shouldShow && showSecondImage && images.length > 0) {
    // If first image matches main image and there is a second image, use second image for hover
    const useSecondImage =
      isFirstImageMatchingMain(mainImage, images) && images.length > 1;
    const hoverIndex = useSecondImage ? 1 : 0;
    const img = images[hoverIndex];
    return img?.thumbnail ?? img?.original;
  }
  return mainImage;
};

export const getImagesForSwiper = (
  mainImage: string | undefined,
  images: ProductImage[],
): ProductImage[] => {
  const allImages =
    !mainImage || isFirstImageMatchingMain(mainImage, images)
      ? images
      : [{ original: mainImage, thumbnail: mainImage }, ...images];

  return allImages.slice(0, 2);
};

export const createHoverTimerManager = () => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  const set = (callback: () => void, delay: number) => {
    clear();
    timer = setTimeout(callback, delay);
  };

  return { set, clear };
};
