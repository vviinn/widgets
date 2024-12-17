export const findTarget = (ev: any) => {
  return ev.target;
};

export const hasSlotContent = (element: HTMLElement, name: string): boolean =>
  !!element.querySelector(`[slot="${name}"]`);

export const getSlotsNames = (slotElements: HTMLSlotElement[]): string[] =>
  slotElements.map((el) => el.getAttribute("slot"));
