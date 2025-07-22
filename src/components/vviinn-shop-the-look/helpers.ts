import { Rectangle, VisualSearchResponse } from "../../interfaces/search";
import { fromImage } from "../../geometry/Rectangle";
import * as E from "fp-ts/lib/Either";
import { Recommendation } from "../../interfaces/recommendation";

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

export interface IntersectionObserverConfig {
  threshold: number;
  onIntersectionChange: (isIntersecting: boolean) => void;
}

export const setupIntersectionObserver = (
  element: HTMLElement,
  config: IntersectionObserverConfig
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
    }
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
  params: VisualSearchParams
): Promise<E.Either<string, { detectedObjects: Rectangle[]; searchResults: Recommendation[] }>> => {
  try {
    const imageFile = await createImageFile(params.imageUrl);
    const { makeUploadFileRequest } = await import("../../store/search.store");

    const result = await makeUploadFileRequest(
      "components",
      params.componentToken || params.token
    )(imageFile);

    return E.fold(
      (error: any) => E.left(`Upload failed: ${error}`),
      (uploadResponse: VisualSearchResponse) => {
        const detectedObjects = uploadResponse.interactions?.suggestedSearchAreas?.map(
          (area) => area.rectangle
        ) || [];
        
        return E.right({
          detectedObjects,
          searchResults: []
        });
      }
    )(result);
  } catch (error) {
    return E.left(`Visual search initialization failed: ${error}`);
  }
};

export interface DetectedObjectClickParams {
  detectedObject: Rectangle;
  imageElement: HTMLImageElement;
  width: number;
  height: number;
  token: string;
  componentToken?: string;
}

export const handleDetectedObjectClick = async (
  params: DetectedObjectClickParams
): Promise<E.Either<string, { searchResults: Recommendation[]; modalPosition: ModalPosition }>> => {
  try {
    const { makeVisualSearchRequest, componentsState } = await import("../../store/search.store");

    componentsState.searchArea = params.detectedObject;
    componentsState.imageBounds = { left: 0, top: 0, width: 1, height: 1 };

    const result = await makeVisualSearchRequest(
      "components",
      null,
      params.componentToken || params.token
    );

    return E.fold(
      (error: any) => E.left(`Visual search failed: ${error}`),
      (searchResponse: VisualSearchResponse) => {
        const searchResults = searchResponse.data?.products || [];
        const modalPosition = calculateModalPosition(
          params.detectedObject,
          params.imageElement,
          params.width,
          params.height
        );

        return E.right({
          searchResults,
          modalPosition
        });
      }
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