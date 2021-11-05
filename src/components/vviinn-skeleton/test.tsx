import { h } from "@stencil/core";

const defaultSlotsNames: string[] = [
  "vviinn-onboarding-card-1-icon",
  "vviinn-onboarding-card-1-text",
  "vviinn-onboarding-card-2-icon",
  "vviinn-onboarding-card-2-text",
  "vviinn-onboarding-card-3-icon",
  "vviinn-onboarding-card-3-text",
];

const renderNamedSlot = (name: string) => <slot name={name} />;

export const SlotSkeleton = () => defaultSlotsNames.map(renderNamedSlot);
