// DOM manipulation utilities
export const findTarget = (ev: any) => {
  return ev.target;
};

export const findSlotElements = (el: HTMLElement): HTMLSlotElement[] =>
  Array.from(el.querySelectorAll("[slot]"));

export const getSlotNames = (slotElements: HTMLSlotElement[]): string[] =>
  slotElements.map((el) => el.getAttribute("slot"));

// Intersection Observer utilities
export * from "./intersectionObserver";

export type EventListenerTuple = [string, EventListenerOrEventListenerObject];

export function addEventListenersWithSignal(
  target: EventTarget,
  listeners: EventListenerTuple[],
  signal: AbortSignal,
) {
  listeners.forEach(([type, handler]) => {
    target.addEventListener(type, handler, { signal });
  });
}

export function disableTabbing(element: Element): void {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  focusableElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (!htmlEl.hasAttribute("data-original-tabindex")) {
      htmlEl.setAttribute("data-original-tabindex", htmlEl.tabIndex.toString());
    }
    htmlEl.tabIndex = -1;
  });
}

export function enableTabbing(element: Element): void {
  const focusableElements = element.querySelectorAll(
    "[data-original-tabindex]",
  );

  focusableElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const originalTabIndex = htmlEl.getAttribute("data-original-tabindex");

    if (originalTabIndex === "0" || originalTabIndex === "") {
      htmlEl.removeAttribute("tabindex");
    } else {
      htmlEl.tabIndex = parseInt(originalTabIndex, 10);
    }
    htmlEl.removeAttribute("data-original-tabindex");
  });
}

export function setElementInteractivity(
  element: Element,
  interactive: boolean,
): void {
  if (interactive) {
    element.removeAttribute("inert");
    element.removeAttribute("aria-hidden");
    enableTabbing(element);
  } else {
    const activeElement = document.activeElement;
    if (activeElement && element.contains(activeElement)) {
      (activeElement as HTMLElement).blur();
    }

    const shadowActiveElements = element.querySelectorAll(":focus");
    shadowActiveElements.forEach((focusedEl) => {
      (focusedEl as HTMLElement).blur();
    });

    Promise.resolve().then(() => {
      element.setAttribute("inert", "");
      element.setAttribute("aria-hidden", "true");
      disableTabbing(element);
    });
  }
}

//  Check if an event target matches a selector, including through shadow DOM boundaries
export function isElementInSelector(
  event: MouseEvent,
  selector: string,
): boolean {
  const target = event.target as HTMLElement;
  const composedPath = event.composedPath?.() || [];
  return (
    !!target?.closest?.(selector) ||
    composedPath.some((el: any) => el.classList?.contains?.(selector.slice(1)))
  );
}
