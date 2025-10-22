// Responsive breakpoints - can be customized per component needs
export const DEFAULT_BREAKPOINTS = {
  DESKTOP: 768,
  SMALL_MOBILE: 375,
  TABLET: 1024,
} as const;

// User agent based device detection
export const checkDeviceType = (): "desktop" | "tablet" | "mobile" => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua,
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

export const isWebKit = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    (/WebKit/.test(ua) && !/Chrome|Edg|OPR/.test(ua)) ||
    /iPhone|iPad|iPod/.test(ua)
  );
};

// Screen size based responsive detection
export const isDesktop = (
  breakpoint: number = DEFAULT_BREAKPOINTS.DESKTOP,
): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= breakpoint;
};

export const isTablet = (
  breakpoint: number = DEFAULT_BREAKPOINTS.TABLET,
): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= breakpoint;
};

export const isMobile = (
  breakpoint: number = DEFAULT_BREAKPOINTS.DESKTOP,
): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoint;
};

export const isSmallMobile = (
  breakpoint: number = DEFAULT_BREAKPOINTS.SMALL_MOBILE,
): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= breakpoint;
};

// Combined device and screen size detection
export const getResponsiveInfo = (
  customBreakpoints?: Partial<typeof DEFAULT_BREAKPOINTS>,
) => {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };

  return {
    deviceType: checkDeviceType(),
    isDesktop: isDesktop(breakpoints.DESKTOP),
    isTablet: isTablet(breakpoints.TABLET),
    isMobile: isMobile(breakpoints.DESKTOP),
    isSmallMobile: isSmallMobile(breakpoints.SMALL_MOBILE),
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 0,
  };
};
