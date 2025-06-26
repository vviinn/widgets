export const findTarget = (ev: any) => {
  return ev.target;
};

export const findSlotElements = (el: HTMLElement): HTMLSlotElement[] =>
  Array.from(el.querySelectorAll("[slot]"));

export const getSlotNames = (slotElements: HTMLSlotElement[]): string[] =>
  slotElements.map((el) => el.getAttribute("slot"));

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
    element.setAttribute("inert", "");
    element.setAttribute("aria-hidden", "true");
    disableTabbing(element);
  }
}
