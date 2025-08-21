import { Pagination } from "swiper/modules";

export interface SwiperSlideChangeEventDetail {
  activeIndex?: number;
  realIndex?: number;
}

export interface SwiperEvent {
  detail: SwiperSlideChangeEventDetail | SwiperSlideChangeEventDetail[];
}

export const extractSlideIndex = (event: SwiperEvent): number | null => {
  let newIndex = null;

  if (event.detail && Array.isArray(event.detail) && event.detail[0]) {
    newIndex = event.detail[0].activeIndex || event.detail[0].realIndex;
  } else if (event.detail && !Array.isArray(event.detail)) {
    newIndex = event.detail.activeIndex || event.detail.realIndex;
  }

  return newIndex;
};

export interface SwiperConfig {
  isDesktop: boolean;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  initialSlide?: number;
  loop?: boolean;
  navigation?: boolean;
  pagination?: boolean;
  keyboard?: boolean;
  mousewheel?: boolean;
  allowTouchMove?: boolean;
  centeredSlides?: boolean;
}

/**
 * Configure Swiper element with common settings
 */
export const configureSwiperElement = (element: any, config: SwiperConfig) => {
  if (!element) return;

  const modules = config.isDesktop ? [] : config.pagination ? [Pagination] : [];

  Object.assign(element, {
    modules,
    navigation: config.navigation ?? false,
    pagination:
      config.pagination && !config.isDesktop
        ? {
            clickable: true,
          }
        : false,
    scrollbar: false,
    keyboard: { enabled: config.keyboard ?? true },
    mousewheel: config.mousewheel ?? false,
    allowTouchMove: config.allowTouchMove ?? true,
    initialSlide: config.initialSlide ?? 0,
    loop: config.loop ?? false,
    slidesPerView: config.slidesPerView ?? (config.isDesktop ? "auto" : 1),
    spaceBetween: config.spaceBetween ?? (config.isDesktop ? 20 : 0),
    centeredSlides: config.centeredSlides ?? false,
  });

  // Initialize swiper after configuration
  if (element.initialize) {
    element.initialize();
  }
};

/**
 * Get responsive Swiper styles
 */
export const getSwiperStyles = (isDesktop: boolean) => {
  return isDesktop
    ? {
        "--swiper-navigation-color": "#8d8d8d",
        "--swiper-navigation-size": "24px",
      }
    : {
        "--swiper-pagination-color": "#8d8d8d",
        "--swiper-pagination-bullet-inactive-color": "rgba(22, 22, 22, 0.25)",
        "--swiper-pagination-bullet-size": "8px",
        "--swiper-pagination-bullet-horizontal-gap": "8px",
        "--swiper-pagination-bottom": "20px",
      };
};
