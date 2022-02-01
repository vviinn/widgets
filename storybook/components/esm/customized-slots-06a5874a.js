import { h } from './index-d92b0799.js';

const defaultSlotsNames = [
  "vviinn-onboarding-card-1-icon",
  "vviinn-onboarding-card-1-text",
  "vviinn-onboarding-card-2-icon",
  "vviinn-onboarding-card-2-text",
  "vviinn-onboarding-card-3-icon",
  "vviinn-onboarding-card-3-text",
  "vviinn-example-images-1",
  "vviinn-example-images-2",
  "vviinn-example-images-3",
  "vviinn-example-images-4",
];
const renderNamedSlot = (name) => h("slot", { name: name });
const SlotSkeleton = () => defaultSlotsNames.map(renderNamedSlot);
const getSlots = (element) => Array.from(element.shadowRoot.querySelectorAll("slot"));
const getNameAttribute = (element) => element.getAttribute("name");
const getSlotAttribute = (element) => element.getAttribute("slot");
const elementContainSlot = (slot) => (container) => {
  const name1 = getNameAttribute(slot);
  const name2 = getSlotAttribute(container);
  return name1 === name2;
};
const getContentToReplace = (targets) => (acc, content) => {
  const replaceCandidate = targets.find(elementContainSlot(content));
  if (replaceCandidate) {
    acc.set(content, replaceCandidate);
  }
  return acc;
};
const replaceSlotContent = (content, target) => {
  target.innerHTML = content.outerHTML;
};
const slotChangeListener = (component, element) => {
  component.connectedCallback = function () {
    document.addEventListener("globalSlotsChanged", ({ detail }) => {
      const slotsToReplace = getSlots(element).reduce(getContentToReplace(detail), new Map());
      slotsToReplace.forEach(replaceSlotContent);
    }, true);
  };
  component.connectedCallback.call(component);
};

export { SlotSkeleton as S, slotChangeListener as s };
