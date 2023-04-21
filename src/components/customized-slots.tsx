import { h } from "@stencil/core";

const defaultSlotsNames: string[] = [
  "vviinn-onboarding-title",
  "onboarding-card-1-icon",
  "onboarding-card-1-text",
  "onboarding-card-2-icon",
  "onboarding-card-2-text",
  "onboarding-card-3-icon",
  "onboarding-card-3-text",
  "vviinn-example-images-title",
  "vviinn-example-images-1",
  "vviinn-example-images-2",
  "vviinn-example-images-3",
  "vviinn-example-images-4",
  "vviinn-teaser-text",
  "vviinn-image-upload-button-text",
  "vviinn-privacy-badge-text",
];

const renderNamedSlot = (name: string) => <slot name={name} />;

export const SlotSkeleton = () => defaultSlotsNames.map(renderNamedSlot);

const getSlots = (element: HTMLElement): HTMLSlotElement[] =>
  Array.from(element.shadowRoot.querySelectorAll("slot"));

const getNameAttribute = (element: HTMLElement): string | null =>
  element.getAttribute("name");

const getSlotAttribute = (element: HTMLElement): string | null =>
  element.getAttribute("slot");

const elementContainSlot =
  (slot: HTMLSlotElement) =>
  (container: HTMLElement): boolean => {
    const name1 = getNameAttribute(slot);
    const name2 = getSlotAttribute(container);

    return name1 === name2;
  };

const getContentToReplace =
  (targets: HTMLElement[]) =>
  (
    acc: Map<HTMLSlotElement, HTMLElement>,
    content: HTMLSlotElement
  ): Map<HTMLSlotElement, HTMLElement> => {
    const replaceCandidate = targets.find(elementContainSlot(content));

    if (replaceCandidate) {
      acc.set(content, replaceCandidate);
    }

    return acc;
  };

const replaceSlotContent = (
  content: HTMLSlotElement,
  target: HTMLElement
): void => {
  target.innerHTML = content.outerHTML;
};

export const slotChangeListener = (component: any, element: HTMLElement) => {
  component.connectedCallback = function () {
    document.addEventListener(
      "globalSlotsChanged",
      ({ detail }: CustomEvent<HTMLElement[]>) => {
        const slotsToReplace: Map<HTMLSlotElement, HTMLElement> = getSlots(
          element
        ).reduce(getContentToReplace(detail), new Map());

        slotsToReplace.forEach(replaceSlotContent);
      },
      true
    );
  };

  component.connectedCallback.call(component);
};
