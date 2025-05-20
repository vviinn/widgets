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
