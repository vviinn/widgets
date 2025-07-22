import { Rectangle, VisualSearchResponse } from "../../interfaces/search";
import * as E from "fp-ts/lib/Either";
import { Recommendation } from "../../interfaces/recommendation";
import { INTERSECTION_THRESHOLDS } from "./constants";
import { isDesktop as sharedIsDesktop, isSmallMobile as sharedIsSmallMobile } from "../../helpers/device/checkDeviceType";
import { calculateImageBounds } from "../../Image/bounds";
import { createImageFile } from "../../Image/upload";
import { extractSlideIndex as sharedExtractSlideIndex } from "../../utils/swiper/swiperUtils";

export interface ModalPosition {
  x: number;
  y: number;
}

export const isDesktop = sharedIsDesktop;
export const isSmallMobile = sharedIsSmallMobile;

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
  if (isVisible) {
    return true;
  }
  return isDesktop;
};

export const shouldRenderDetectedObjects = (
  imageState: any,
  visibleImageIndices: Set<number>,
  imageIndex: number,
): boolean => {
  if (!imageState) return false;

  const isDesktopView = isDesktop();
  return isDesktopView
    ? imageState.isVisible || visibleImageIndices.has(imageIndex)
    : imageState.isVisible;
};

export const calculateModalPosition = (
  imageElement: HTMLImageElement,
  containerElement?: HTMLElement,
): ModalPosition => {
  if (!imageElement) return { x: 0, y: 0 };

  const imageBounds = calculateImageBounds(imageElement);
  if (!imageBounds) return { x: 0, y: 0 };

  const isDesktopView = isDesktop();

  if (isDesktopView) {
    let containerBounds = { left: 0, top: 0 };
    if (containerElement) {
      const containerRect = containerElement.getBoundingClientRect();
      containerBounds = { left: containerRect.left, top: containerRect.top };
    }
    const x = imageBounds.left - containerBounds.left + imageBounds.width / 2;
    const y = imageBounds.top - containerBounds.top + imageBounds.height / 2;
    return { x, y };
  } else {
    return { x: 0, y: 0 };
  }
};

export { calculateImageBounds, hasImageBoundsChanged } from "../../Image/bounds";
export { createImageFile } from "../../Image/upload";
export { setupIntersectionObserver, type IntersectionObserverConfig } from "../../dom";

export const resetSearchState = () => ({
  detectedObjects: [],
  searchResults: [],
  showModal: false,
  selectedDetectedObject: null,
  modalPosition: null,
  initialSearchCompleted: false,
});

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

export const extractSlideIndex = sharedExtractSlideIndex;
export { type SwiperSlideChangeEventDetail as SlideChangeEventDetail } from "../../utils/swiper/swiperUtils";
