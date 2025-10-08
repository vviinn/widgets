import {
  Rectangle,
  VisualSearchResponse,
  SuggestedSearchArea,
} from "../../interfaces/search";
import * as E from "fp-ts/lib/Either";
import { Recommendation } from "../../interfaces";
import { BasicError } from "../../error";
import { INTERSECTION_THRESHOLDS } from "./constants";
import {
  isDesktop as sharedIsDesktop,
  isSmallMobile as sharedIsSmallMobile,
} from "../../helpers/device/checkDeviceType";
import { calculateImageBounds } from "../../Image/bounds";
import { createImageFile } from "../../Image/upload";
import {
  makeUploadFileRequest,
  makeVisualSearchRequest,
  shopTheLookState,
} from "../../store/search.store";
import { imageFromFileTask } from "../../Image/fromFile";
import { ImageState } from "./store";

export type AnchorPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export interface ModalPosition {
  x: number;
  y: number;
  anchor?: AnchorPosition;
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
  imageState: ImageState | null,
  isActiveSlide: boolean,
): boolean => {
  if (!imageState) return false;

  return isDesktop()
    ? imageState.searchCompleted && !!imageState.detectedObjects?.length
    : isActiveSlide;
};

export const calculateModalPosition = (
  imageElement: HTMLImageElement,
  detectedObject: Rectangle,
  containerElement?: HTMLElement,
  preCalculatedImageBounds?: Rectangle | null,
): ModalPosition => {
  const imageBounds =
    preCalculatedImageBounds || calculateImageBounds(imageElement);
  if (!imageBounds) return { x: 0, y: 0 };

  const objectCenterX =
    (detectedObject.left + detectedObject.width / 2) * imageBounds.width;
  const objectCenterY =
    (detectedObject.top + detectedObject.height / 2) * imageBounds.height;

  const midX = imageBounds.width / 2;
  const midY = imageBounds.height / 2;

  const anchor = [
    objectCenterY > midY ? "bottom" : "top",
    objectCenterX > midX ? "right" : "left",
  ].join("-") as AnchorPosition;

  const offset = isDesktop() ? 24 : 16;
  const isMobile = !isDesktop();
  const mobileXShift = 32;
  const mobileYOffset = 6;

  let offsetX = 0,
    offsetY = 0;

  switch (anchor) {
    case "top-left":
      offsetX = isMobile ? offset - mobileXShift : offset;
      offsetY = isMobile ? offset + mobileYOffset : offset;
      break;
    case "top-right":
      offsetX = isMobile ? -offset + mobileXShift : -offset;
      offsetY = isMobile ? offset + mobileYOffset : offset;
      break;
    case "bottom-left":
      offsetX = isMobile ? offset - mobileXShift : offset;
      offsetY = isMobile ? -offset - mobileYOffset : -offset;
      break;
    case "bottom-right":
      offsetX = isMobile ? -offset + mobileXShift : -offset;
      offsetY = isMobile ? -offset - mobileYOffset : -offset;
      break;
  }

  const screenX = imageBounds.left + objectCenterX + offsetX;
  const screenY = imageBounds.top + objectCenterY + offsetY;

  if (containerElement) {
    const containerRect = containerElement.getBoundingClientRect();
    const x = screenX - containerRect.left;
    const y = screenY - containerRect.top;
    return { x, y, anchor };
  }

  return { x: screenX, y: screenY, anchor };
};

export { calculateImageBounds } from "../../Image/bounds";
export { createImageFile } from "../../Image/upload";
export {
  setupIntersectionObserver,
  type IntersectionObserverConfig,
} from "../../dom";

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
  campaignId?: string;
}

export const performVisualSearch = async (
  params: VisualSearchParams,
): Promise<
  E.Either<
    string,
    {
      detectedObjects: Rectangle[];
      searchResults: Recommendation[];
      visualSearchId: string | null;
    }
  >
> => {
  try {
    const imageFile = await createImageFile(params.imageUrl);

    const result = await makeUploadFileRequest(
      "shopTheLook",
      params.token,
      params.campaignId,
    )(imageFile);

    return E.fold(
      (error: BasicError<string | Response>) =>
        E.left(`Upload failed: ${error.inner}`),
      (uploadResponse: VisualSearchResponse) => {
        const detectedObjects =
          uploadResponse.interactions?.suggestedSearchAreas?.map(
            (area) => area.rectangle,
          ) || [];

        return E.right({
          detectedObjects,
          searchResults: [],
          visualSearchId: uploadResponse.requestId || null,
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
  containerElement?: HTMLElement;
  token: string;
  visualSearchId?: string | null;
  campaignId?: string;
  isSearchInProgress: boolean;
  setSearchInProgress: (inProgress: boolean) => void;
  imageBounds?: Rectangle | null;
}

export const handleDetectedObjectClick = async (
  params: DetectedObjectClickParams,
): Promise<
  E.Either<
    string,
    { searchResults: Recommendation[]; modalPosition: ModalPosition }
  >
> => {
  const {
    imageElement,
    detectedObject,
    containerElement,
    visualSearchId,
    token,
    imageBounds,
    campaignId,
    isSearchInProgress,
    setSearchInProgress,
  } = params;

  if (isSearchInProgress) {
    return E.left("Search already in progress");
  }

  setSearchInProgress(true);

  try {
    if (!imageElement) {
      return E.left("Image element is missing");
    }

    shopTheLookState.searchArea = detectedObject;

    const result = await makeVisualSearchRequest(
      "shopTheLook",
      visualSearchId || null,
      token,
      campaignId,
    );

    return E.fold(
      (error: BasicError<string | Response>) =>
        E.left(`Visual search failed: ${error.inner}`),
      (searchResponse: VisualSearchResponse) => {
        const searchResults = searchResponse.data?.products || [];
        const modalPosition = calculateModalPosition(
          imageElement,
          detectedObject,
          containerElement,
          imageBounds,
        );

        return E.right({
          searchResults,
          modalPosition,
        });
      },
    )(result);
  } catch (error) {
    return E.left(`Visual search failed: ${error}`);
  } finally {
    setSearchInProgress(false);
  }
};

export const autoSelectFirstObject = (
  imageIndex: number,
  detectedObjects: Rectangle[],
  onSelectObject: (
    detectedObject: Rectangle,
    objectIndex: number,
    imageIndex: number,
  ) => Promise<void>,
  delay: number,
) => {
  if (detectedObjects.length > 0) {
    setTimeout(async () => {
      await onSelectObject(detectedObjects[0], 0, imageIndex);
    }, delay);
  }
};

export const buildImageUrlsList = (
  uploadedImageUrls: string[],
  imageUrlsProp: string,
): string[] => {
  const propImageUrls =
    imageUrlsProp && imageUrlsProp.trim()
      ? imageUrlsProp
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      : [];

  return [...uploadedImageUrls, ...propImageUrls];
};

export interface ProcessFileUploadParams {
  file: File;
  token: string;
  campaignId?: string;
}

export interface ProcessFileUploadResult {
  imageUrl: string;
  detectedObjects: Rectangle[];
  visualSearchId: string | null;
}

export const processFileUpload = async (
  params: ProcessFileUploadParams,
): Promise<E.Either<string, ProcessFileUploadResult>> => {
  const { file, token, campaignId } = params;

  try {
    const imageElement = await imageFromFileTask(file)();
    const imageUrl = imageElement.src;

    const uploadResult = await makeUploadFileRequest(
      "shopTheLook",
      token,
      campaignId,
    )(file);

    return E.fold(
      (error: BasicError<string | Response>) =>
        E.left(`Upload failed: ${error.inner}`),
      (response: VisualSearchResponse) => {
        const detectedObjects =
          response.interactions?.suggestedSearchAreas?.map(
            (area: SuggestedSearchArea) => area.rectangle,
          ) || [];

        return E.right({
          imageUrl,
          detectedObjects,
          visualSearchId: response.requestId || null,
        });
      },
    )(uploadResult);
  } catch (error) {
    return E.left(`Failed to process image: ${error}`);
  }
};
