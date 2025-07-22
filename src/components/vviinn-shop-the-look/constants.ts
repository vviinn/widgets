export const RESPONSIVE_BREAKPOINTS = {
  DESKTOP: 768,
  SMALL_MOBILE: 375,
} as const;

export const INTERSECTION_THRESHOLDS = {
  DESKTOP_VISIBLE: 0.1, // 10% visible - preserves objects on sliced images
  MOBILE_VISIBLE: 0.33, // 33% visible - better UX on mobile
  DESKTOP_FULL_VISIBLE: 1.0, // 100% visible
} as const;

export const TIMING = {
  SWIPER_INIT_DELAY: 200,
  SEARCH_DELAY: 500,
  SLIDE_TRANSITION_DELAY: 100,
} as const;

export const MODAL_DIMENSIONS = {
  WIDTH: 184, // 160px + 24px padding
  HEIGHT: 184, // 160px + 24px padding
} as const;

export const Z_INDEX = {
  DETECTED_OBJECT: 10,
  DETECTED_OBJECT_DESKTOP: 15,
  SEARCH_LOADER: 100,
  MODAL_OVERLAY: 1000,
  MODAL_CONTENT: 2000,
} as const;