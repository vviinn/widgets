import { h, JSX } from "@stencil/core";
import { FilterIconClose } from "../../vviinn-icons";
import { TextIcon } from "../../vviinn-icons/icons/TextIcon";

type RenderCustomButtonProps = {
  buttonType: "image" | "text" | "price" | "crop";
  onClick: () => void;
  label?: string;
  imageSrc?: string;
  hidden?: boolean;
};

export const RenderCustomButton = ({
  buttonType,
  label,
  onClick,
  imageSrc,
  hidden,
}: RenderCustomButtonProps): JSX.Element => {
  return (
    <li part="filters-sub-row" class={{ hidden }}>
      <button
        onClick={onClick}
        class={`filters-more-modal-button active`}
        part="filters-option-button"
      >
        {(buttonType === "image" || buttonType === "crop") &&
          !!imageSrc?.length && (
            <img
              class="buton-image"
              part="filters-option-image"
              width="24"
              height="24"
              src={imageSrc}
            />
          )}

        {buttonType === "text" && <TextIcon />}

        <span part="filters-option-text">
          {buttonType === "image" && (
            <slot name="vviinn-image-filter-text">{label}</slot>
          )}
          {buttonType === "crop" && (
            <slot name="vviinn-crop-filter-text">{label}</slot>
          )}
          {(buttonType === "text" || buttonType === "price") && label}
        </span>
        <FilterIconClose />
      </button>
    </li>
  );
};
