import { h } from "@stencil/core";
import { ArrowIcon } from "../vviinn-icons";
const getStyleMap = (data) => {
  return {
    "arrow-wrapper": true,
    [data.kind]: true,
    disabled: data.disabled,
  };
};
export const Arrow = ({ kind, tabindex, disabled, onClick, onKeyDown, }) => (h("div", { class: getStyleMap({ kind, disabled }), onClick: onClick, tabindex: tabindex, onKeyDown: onKeyDown },
  h(ArrowIcon, null)));
