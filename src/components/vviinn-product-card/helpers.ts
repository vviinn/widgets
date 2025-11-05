import { ProductImage } from "../../interfaces";

export const HOVER_DELAY_MS = 65;

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
    // If first image matches main image, use second image for hover
    const hoverIndex = isFirstImageMatchingMain(mainImage, images) ? 1 : 0;
    const img = images[hoverIndex];
    return img.thumbnail ?? img.original;
  }
  return mainImage;
};

export const getImagesForSwiper = (
  mainImage: string | undefined,
  images: ProductImage[],
): ProductImage[] => {
  if (!mainImage || isFirstImageMatchingMain(mainImage, images)) return images;
  return [{ original: mainImage, thumbnail: mainImage }, ...images];
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
