export interface IntersectionObserverConfig {
  threshold: number;
  onIntersectionChange: (isIntersecting: boolean) => void;
  rootMargin?: string;
}

/**
 * Create an intersection observer with proper fallback for SSR
 */
export const setupIntersectionObserver = (
  element: HTMLElement,
  config: IntersectionObserverConfig,
): IntersectionObserver | null => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    // SSR safety - no events on server, only browser-side intersection tracking
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
      rootMargin: config.rootMargin,
    },
  );

  observer.observe(element);
  return observer;
};

/**
 * Create an intersection observer for multiple elements with individual callbacks
 */
export const setupMultipleIntersectionObserver = (
  elements: Array<{ element: HTMLElement; callback: (isIntersecting: boolean) => void }>,
  config: Omit<IntersectionObserverConfig, 'onIntersectionChange'>,
): IntersectionObserver | null => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    // SSR safety - no callbacks on server, only browser-side intersection tracking
    return null;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isIntersecting = entry.intersectionRatio >= config.threshold;
        const elementConfig = elements.find(({ element }) => element === entry.target);
        if (elementConfig) {
          elementConfig.callback(isIntersecting);
        }
      });
    },
    {
      threshold: config.threshold,
      rootMargin: config.rootMargin,
    },
  );

  elements.forEach(({ element }) => observer.observe(element));
  return observer;
};