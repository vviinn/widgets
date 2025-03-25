const INITIAL_CROP_AREA = 0.9;
export const INITIAL_CROP_AREA_OFFSET = 1 - INITIAL_CROP_AREA;
export const MIN_SEARCH_AREA_SIZE = 82;
export const MIN_IMAGE_SIDE_FOR_CROPPER = 90;
export const SUPPORTED_ASPECT_RATIO = 0.1;
export const DEFAULT_IMAGE_SIZE = 288;

export const cropperOptions: Cropper.Options = {
  autoCropArea: INITIAL_CROP_AREA,
  minCropBoxHeight: MIN_SEARCH_AREA_SIZE,
  minCropBoxWidth: MIN_SEARCH_AREA_SIZE,
  minContainerWidth: MIN_IMAGE_SIDE_FOR_CROPPER,
  minContainerHeight: MIN_IMAGE_SIDE_FOR_CROPPER,
  movable: false,
  zoomable: false,
  rotatable: false,
  scalable: false,
  zoomOnTouch: false,
  zoomOnWheel: false,
  toggleDragModeOnDblclick: false,
  viewMode: 1,
};
