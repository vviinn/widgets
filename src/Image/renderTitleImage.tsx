import { h } from "@stencil/core";

export const renderTitleImage = (
  image: HTMLImageElement,
): HTMLImageElement | null =>
  image ? (
    <img width="28" height="28" src={image.src} class="title-image" />
  ) : null;
