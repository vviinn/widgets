export const findTarget = (ev: any) => {
  return ev.target;
};

export const findSlotElements = (el: HTMLElement): HTMLSlotElement[] =>
  Array.from(el.querySelectorAll("[slot]"));

export const getSlotNames = (slotElements: HTMLSlotElement[]): string[] =>
  slotElements.map((el) => el.getAttribute("slot"));
