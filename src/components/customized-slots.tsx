import { h } from "@stencil/core";

const vprSlotNames: string[] = [
  "vviinn-recommendations-title",
  "vviinn-recommendations-subtitle",
  "vviinn-update-button-text",
  "vviinn-update-button-icon",
];

const vpsSlotNames: string[] = [
  "vviinn-teaser-text",
  "vviinn-image-upload-button-text",
  "vviinn-image-upload-icon",
  "vviinn-camera-button-text-start",
  "vviinn-camera-button-text-stop",
  "vviinn-camera-icon",
  "vviinn-text-search-icon",
  "vviinn-privacy-badge-text",
  "vviinn-image-search-modal-title",
];

const filtersSlotNames: string[] = [
  "vviinn-extended-filters-title",
  "vviinn-extended-filters-apply",
  "vviinn-extended-filters-reset",
  "vviinn-image-filter-text",
  "vviinn-crop-filter-text",
];

export const productCardSlotNames: string[] = [
  "vviinn-basket-button-icon",
  "vviinn-basket-button-text",
  "vviinn-basket-button-icon-pressed",
  "vviinn-basket-button-text-pressed",
  "vviinn-favorite-icon",
  "vviinn-favorite-icon-pressed",
  "vviinn-energy-label-data-sheet-text",
  "vviinn-product-card-actions",
  "vviinn-custom-label-0",
  "vviinn-custom-label-1",
  "vviinn-custom-label-2",
  "vviinn-custom-label-3",
  "vviinn-custom-label-4",
];

export const vprIconSlotName = "vviinn-results-vpr-icon";

const renderNamedSlot = (name: string) => <slot name={name} />;

type RenderType = "search" | "discovery" | "filters" | "card";

const getSlotNamesList = (renderType: RenderType) => {
  switch (renderType) {
    case "search": {
      return [...vpsSlotNames, ...filtersSlotNames, ...productCardSlotNames];
    }
    case "discovery": {
      return [...vprSlotNames, ...filtersSlotNames, ...productCardSlotNames];
    }
    case "filters": {
      return filtersSlotNames;
    }
    case "card": {
      return productCardSlotNames;
    }
  }
};

export const SlotSkeleton = (renderType: RenderType) =>
  getSlotNamesList(renderType).map(renderNamedSlot);

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
    content: HTMLSlotElement,
  ): Map<HTMLSlotElement, HTMLElement> => {
    const replaceCandidate = targets.find(elementContainSlot(content));

    if (replaceCandidate) {
      acc.set(content, replaceCandidate);
    }

    return acc;
  };

const replaceSlotContent = (
  content: HTMLSlotElement,
  target: HTMLElement,
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
          "VVIINN-CAMERA",
          "VVIINN-PRIVACY-BADGE",
          "VVIINN-MODAL",
          "VVIINN-TEXT-SEARCH",
          "VVIINN-EXTENDED-FILTERS",
          "VVIINN-SELECTED-FILTERS",
        ].includes(elementTagName);

        const productCardChildrenTags = ["VVIINN-ENERGY-LABEL"];

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

        const elementIsNotChildOfProductCard =
          !productCardChildrenTags.includes(elementTagName);

        if (
          elementsAreDifferent &&
          elementIsNotRelatedToCurrentDetailElement &&
          elementIsNotChildOfProductCard
        ) {
          return;
        }

        const slotsToReplace: Map<HTMLSlotElement, HTMLElement> = getSlots(
          element,
        ).reduce(getContentToReplace(detail.slots), new Map());

        slotsToReplace.forEach(replaceSlotContent);
      },
      true,
    );
  };

  component.connectedCallback.call(component);
};
