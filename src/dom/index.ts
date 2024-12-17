export const findTarget = (ev: any) => {
  return ev.target;
};

export const hasSlotContent = (element: HTMLElement, name: string) =>
  !!element.querySelector(`[slot="${name}"]`);
