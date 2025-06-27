import { h } from "@stencil/core";
import i18next from "i18next";

export const renderTitleImage = (
  image: HTMLImageElement,
): HTMLImageElement | null =>
  image ? (
    <img
      width="28"
      height="28"
      src={image.src}
      class="title-image"
      alt={i18next.t("a11y.uploadedImage")}
    />
  ) : null;
