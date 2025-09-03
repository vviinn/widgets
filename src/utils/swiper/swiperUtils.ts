import { Pagination } from "swiper/modules";

type SwiperSlideChangeEventDetail = {
  activeIndex?: number;
  realIndex?: number;
};

type SwiperEvent = {
  detail: SwiperSlideChangeEventDetail | SwiperSlideChangeEventDetail[];
};

export const extractSlideIndex = (event: SwiperEvent): number | undefined => {
  let newIndex = undefined;

  if (event.detail && Array.isArray(event.detail) && event.detail[0]) {
    newIndex = event.detail[0].activeIndex || event.detail[0].realIndex;
  } else if (event.detail && !Array.isArray(event.detail)) {
    newIndex = event.detail.activeIndex || event.detail.realIndex;
  }

  return newIndex;
};

export interface ConfigurableSwiperElement {
  [key: string]: any;
  initialize?: () => void;
}

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

export const configureSwiperElement = (
  element: ConfigurableSwiperElement,
  config: SwiperConfig,
) => {
  if (!element) return;

  const {
    isDesktop,
    navigation = false,
    pagination = false,
    keyboard = true,
    mousewheel = false,
    allowTouchMove = true,
    initialSlide = 0,
    loop = false,
    slidesPerView = isDesktop ? "auto" : 1,
    spaceBetween = isDesktop ? 20 : 8,
    centeredSlides = false,
  } = config;

  const modules = isDesktop ? [] : pagination ? [Pagination] : [];

  Object.assign(element, {
    modules,
    navigation,
    pagination: pagination && !isDesktop ? { clickable: true } : false,
    scrollbar: false,
    keyboard: { enabled: keyboard },
    mousewheel,
    allowTouchMove,
    initialSlide,
    loop,
    slidesPerView,
    spaceBetween,
    centeredSlides,
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
