import { h } from "@stencil/core";

const vprSlotsNames: string[] = [
  "vviinn-recommendations-title",
  "vviinn-recommendations-subtitle",
  "vviinn-basket-button-text",
  "vviinn-basket-button-icon",
  "vviinn-update-button-icon",
  "vviinn-update-button-text",
];

const vpsSlotsNames: string[] = [
  "vviinn-teaser-text",
  "vviinn-image-upload-button-text",
  "vviinn-image-upload-icon",
  "vviinn-camera-button-text-start",
  "vviinn-camera-button-text-stop",
  "vviinn-camera-icon",
  "vviinn-camera-capture-text",
  "vviinn-text-search-icon",
  "vviinn-privacy-badge-text",
  "vviinn-image-search-modal-title",
];

const renderNamedSlot = (name: string) => <slot name={name} />;

export const SlotSkeleton = (renderType: string) => {
  return (renderType === "vps" ? vpsSlotsNames : vprSlotsNames).map(
    renderNamedSlot
  );
};

const getSlots = (element: HTMLElement): HTMLSlotElement[] => {
  return Array.from(element.shadowRoot.querySelectorAll("slot"));
};

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

type Detail = CustomEvent<{
  slots: HTMLElement[];
  element: HTMLElement;
}>;

const castAsHtmlElement = (element: ChildNode) => element as HTMLElement;
const getShadowRoots = (shadowRoot: ShadowRoot) => {
  const levelOne = shadowRoot;
  const levelTwo = levelOne && castAsHtmlElement(levelOne.lastChild).shadowRoot;
  const levelThree =
    levelTwo && castAsHtmlElement(levelTwo.lastChild).shadowRoot;

  return { levelOne, levelTwo, levelThree };
};

export const slotChangeListener = (component: any, element: HTMLElement) => {
  component.connectedCallback = function () {
    document.addEventListener(
      "globalSlotsChanged",
      ({ detail }: Detail) => {
        const elementTagName = element.tagName;

        const isElementChildTag = [
          "VVIINN-PRODUCT-CARD",
          "VVIINN-TEASER",
          "VVIINN-EXAMPLE-IMAGE",
          "VVIINN-PRIVACY-BADGE",
          "VVIINN-MODAL",
          "VVIINN-TEXT-SEARCH",
        ].includes(elementTagName);

        const elementsAreDifferent = element !== detail.element;

        const elementsAreDifferentAndNotChildTag =
          elementsAreDifferent && !isElementChildTag;

        const isSearchButtonTag =
          detail.element.tagName === "VVIINN-VPS-BUTTON" &&
          elementTagName === "VVIINN-VPS-WIDGET";

        const detailElementShadowRoot = detail.element.shadowRoot;

        const {
          levelOne: detailLevelOneShadowRoot,
          levelTwo: detailLevelTwoShadowRoot,
          levelThree: detailLevelThreeShadowRoot,
        } = getShadowRoots(detailElementShadowRoot);

        const elementIsNotChildOfDetailElement =
          !(
            detailLevelOneShadowRoot &&
            detailLevelOneShadowRoot.contains(element)
          ) &&
          !(
            detailLevelTwoShadowRoot &&
            detailLevelTwoShadowRoot.contains(element)
          ) &&
          !(
            detailLevelThreeShadowRoot &&
            detailLevelThreeShadowRoot.contains(element)
          );

        const elementIsChildTagButNotChildOfDetailElement =
          isElementChildTag && elementIsNotChildOfDetailElement;

        const isNotChildOfCurrentDetailElement =
          (elementsAreDifferentAndNotChildTag ||
            elementIsChildTagButNotChildOfDetailElement) &&
          !isSearchButtonTag;

        const isNotChildOfCurrentSearchButton =
          isSearchButtonTag && !detailElementShadowRoot.contains(element);

        const elementIsNotRelatedToCurrentDetailElement =
          isNotChildOfCurrentDetailElement || isNotChildOfCurrentSearchButton;

        if (elementIsNotRelatedToCurrentDetailElement) {
          return;
        }

        const slotsToReplace: Map<HTMLSlotElement, HTMLElement> = getSlots(
          element
        ).reduce(getContentToReplace(detail.slots), new Map());

        slotsToReplace.forEach(replaceSlotContent);
      },
      true
    );
  };

  component.connectedCallback.call(component);
};
