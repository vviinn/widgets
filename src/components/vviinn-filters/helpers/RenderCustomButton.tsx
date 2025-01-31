import { h, JSX } from "@stencil/core";
import { CloseFilterIcon } from "../../vviinn-icons";
import { TextIcon } from "../../vviinn-icons/icons/TextIcon";

type RenderCustomButtonProps = {
  buttonType: "image" | "text";
  onClick: () => void;
  label?: string;
};

export const RenderCustomButton = ({
  buttonType,
  label,
  onClick,
}: RenderCustomButtonProps): JSX.Element => {
  return (
    buttonType === "text" && (
      <li part="filters-sub-row">
        <button
          onClick={onClick}
          class={`filters-more-modal-button  active`}
          part="filters-option-button"
        >
          <TextIcon />
          <span part="filters-option-text">{label}</span>
          <CloseFilterIcon />
        </button>
      </li>
    )
  );
};
