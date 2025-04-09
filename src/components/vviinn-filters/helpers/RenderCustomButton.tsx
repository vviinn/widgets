import { h, JSX } from "@stencil/core";
import { FilterIconClose } from "../../vviinn-icons";
import { TextIcon } from "../../vviinn-icons/icons/TextIcon";

type RenderCustomButtonProps = {
  buttonType: "image" | "text" | "price";
  onClick: () => void;
  label?: string;
  imageSrc?: string;
};

export const RenderCustomButton = ({
  buttonType,
  label,
  onClick,
  imageSrc,
}: RenderCustomButtonProps): JSX.Element => {
  return (
    <li part="filters-sub-row">
      <button
        onClick={onClick}
        class={`filters-more-modal-button active`}
        part="filters-option-button"
      >
        {buttonType === "image" && (
          <img class="buton-image" width="24" height="24" src={imageSrc} />
        )}
        {buttonType === "text" && <TextIcon />}
        <span part="filters-option-text">{label}</span>
        <FilterIconClose />
      </button>
    </li>
  );
};
