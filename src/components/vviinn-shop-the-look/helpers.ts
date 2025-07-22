import { Rectangle, VisualSearchResponse } from "../../interfaces/search";
import * as E from "fp-ts/lib/Either";
import { Recommendation } from "../../interfaces/recommendation";
import { RESPONSIVE_BREAKPOINTS, INTERSECTION_THRESHOLDS } from "./constants";

export interface ModalPosition {
  x: number;
  y: number;
}

export const isDesktop = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= RESPONSIVE_BREAKPOINTS.DESKTOP;
};

export const isSmallMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= RESPONSIVE_BREAKPOINTS.SMALL_MOBILE;
};

export const getVisibilityThreshold = (isDesktop: boolean): number => {
  return isDesktop
    ? INTERSECTION_THRESHOLDS.DESKTOP_VISIBLE
    : INTERSECTION_THRESHOLDS.MOBILE_VISIBLE;
};

export interface VisibilityUpdateParams {
  index: number;
  isVisible: boolean;
  isDesktop: boolean;
  visibleImageIndices: Set<number>;
}

export const shouldKeepImageVisible = (
  params: VisibilityUpdateParams,
): boolean => {
  const { isVisible, isDesktop } = params;
  // On desktop, keep partially visible images in the visible set to preserve objects
  // On mobile, only keep fully visible images
  if (isVisible) {
    return true;
  }
  return isDesktop; // Desktop keeps images visible even when not intersecting
};

export const shouldRenderDetectedObjects = (
  imageState: any,
  visibleImageIndices: Set<number>,
  imageIndex: number,
): boolean => {
  if (!imageState) return false;

  const isDesktopView = isDesktop();
  // On desktop, render objects even for partially visible (sliced) images
  // On mobile, only render when image is fully visible
  return isDesktopView
    ? imageState.isVisible || visibleImageIndices.has(imageIndex)
    : imageState.isVisible;
};

export const calculateModalPosition = (
  imageElement: HTMLImageElement,
  containerElement?: HTMLElement,
): ModalPosition => {
  if (!imageElement) return { x: 0, y: 0 };

  // Get the actual image bounds
  const imageBounds = calculateImageBounds(imageElement);
  if (!imageBounds) return { x: 0, y: 0 };

  const isDesktopView = isDesktop();

  if (isDesktopView) {
    // Desktop: Position relative to the image center within the component
    // Get container bounds to calculate relative positioning
    let containerBounds = { left: 0, top: 0 };
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      containerBounds = { left: containerRect.left, top: containerRect.top };
    }
    
    // Calculate position relative to container
    const x = imageBounds.left - containerBounds.left + imageBounds.width / 2;
    const y = imageBounds.top - containerBounds.top + imageBounds.height / 2;
    return { x, y };
  } else {
    // Mobile: center within component bounds (50% of container)
    return { x: 0, y: 0 }; // Will use CSS centering via 50%/50%
  }
};

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

export interface IntersectionObserverConfig {
  threshold: number;
  onIntersectionChange: (isIntersecting: boolean) => void;
}

export const setupIntersectionObserver = (
  element: HTMLElement,
  config: IntersectionObserverConfig,
): IntersectionObserver | null => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    config.onIntersectionChange(true);
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.intersectionRatio >= config.threshold;
        config.onIntersectionChange(isIntersecting);
      });
    },
    {
      threshold: config.threshold,
    },
  );

  observer.observe(element);
  return observer;
};

export interface VisualSearchParams {
  imageUrl: string;
  token: string;
  componentToken?: string;
}

export const performVisualSearch = async (
  params: VisualSearchParams,
): Promise<
  E.Either<
    string,
    { detectedObjects: Rectangle[]; searchResults: Recommendation[] }
  >
> => {
  try {
    const imageFile = await createImageFile(params.imageUrl);
    const { makeUploadFileRequest } = await import("../../store/search.store");

    const result = await makeUploadFileRequest(
      "components",
      params.componentToken || params.token,
    )(imageFile);

    return E.fold(
      (error: any) => E.left(`Upload failed: ${error}`),
      (uploadResponse: VisualSearchResponse) => {
        const detectedObjects =
          uploadResponse.interactions?.suggestedSearchAreas?.map(
            (area) => area.rectangle,
          ) || [];

        return E.right({
          detectedObjects,
          searchResults: [],
        });
      },
    )(result);
  } catch (error) {
    return E.left(`Visual search initialization failed: ${error}`);
  }
};

export interface DetectedObjectClickParams {
  detectedObject: Rectangle;
  imageElement: HTMLImageElement;
  token: string;
  componentToken?: string;
  containerElement?: HTMLElement;
}

export const handleDetectedObjectClick = async (
  params: DetectedObjectClickParams,
): Promise<
  E.Either<
    string,
    { searchResults: Recommendation[]; modalPosition: ModalPosition }
  >
> => {
  try {
    const { makeVisualSearchRequest, componentsState } = await import(
      "../../store/search.store"
    );

    componentsState.searchArea = params.detectedObject;
    componentsState.imageBounds = { left: 0, top: 0, width: 1, height: 1 };

    const result = await makeVisualSearchRequest(
      "components",
      null,
      params.componentToken || params.token,
    );

    return E.fold(
      (error: any) => E.left(`Visual search failed: ${error}`),
      (searchResponse: VisualSearchResponse) => {
        const searchResults = searchResponse.data?.products || [];
        const modalPosition = calculateModalPosition(
          params.imageElement,
          params.containerElement,
        );

        return E.right({
          searchResults,
          modalPosition,
        });
      },
    )(result);
  } catch (error) {
    return E.left(`Visual search failed: ${error}`);
  }
};

export interface SlideChangeEventDetail {
  activeIndex?: number;
  realIndex?: number;
}

export const extractSlideIndex = (event: any): number | null => {
  let newIndex = null;

  if (event.detail && Array.isArray(event.detail) && event.detail[0]) {
    newIndex = event.detail[0].activeIndex || event.detail[0].realIndex;
  } else if (event.detail && event.detail.activeIndex !== undefined) {
    newIndex = event.detail.activeIndex;
  } else if (event.detail && event.detail.realIndex !== undefined) {
    newIndex = event.detail.realIndex;
  }

  return newIndex;
};
