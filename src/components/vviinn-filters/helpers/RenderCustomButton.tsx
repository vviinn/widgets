import { h, JSX } from "@stencil/core";

import { CloseFilterIcon } from "../../vviinn-icons";

type RenderCustomButtonProps = {
  buttonType: "image" | "text";
  label: string;
};

export const RenderCustomButton = ({
  buttonType,
  label,
}: RenderCustomButtonProps): JSX.Element => {
  return (
    buttonType === "text" && (
      <li part="filters-sub-row">
        <button
          onClick={() => {}}
          class={`filters-more-modal-button  active`}
          part="filters-option-button"
        >
          <span>
            <span part="filters-option-text">{label}</span>
            <CloseFilterIcon />
          </span>
        </button>
      </li>
    )
  );
};
