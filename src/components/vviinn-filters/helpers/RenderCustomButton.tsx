import { h, JSX } from "@stencil/core";
import { CloseFilterIcon } from "../../vviinn-icons";

type RenderCustomButtonProps = {
  buttonType: "image" | "text";
  onButtonClick: () => void;
  label?: string;
};

export const RenderCustomButton = ({
  buttonType,
  label,
  onButtonClick,
}: RenderCustomButtonProps): JSX.Element => {
  return (
    buttonType === "text" && (
      <li part="filters-sub-row">
        <button
          onClick={onButtonClick}
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
