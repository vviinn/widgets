import { h, JSX } from "@stencil/core";
import { getRemoveFilterAriaLabel } from "../../../a11y";
import { FilterIconClose } from "../../vviinn-icons";
import { TextIcon } from "../../vviinn-icons/icons/TextIcon";

type RenderCustomButtonProps = {
  buttonType: "image" | "text" | "range" | "crop";
  onClick?: () => void;
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
  const isClickable = !!onClick;

  const ariaLabel =
    isClickable && label
      ? getRemoveFilterAriaLabel(label)
      : !label
        ? buttonType
        : undefined;

  return (
    <li part="filters-sub-row" class={{ hidden }}>
      <button
        onClick={onClick}
        class={`filters-more-modal-button custom active ${isClickable ? "clickable" : ""}`}
        part="filters-option-button"
        {...(ariaLabel && { "aria-label": ariaLabel })}
        type="button"
        disabled={!isClickable && !label}
      >
        {(buttonType === "image" || buttonType === "crop") &&
          !!imageSrc?.length && (
            <img
              part="filters-option-image"
              width="24"
              height="24"
              src={imageSrc}
              alt=""
              aria-hidden="true"
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
          {(buttonType === "text" || buttonType === "range") && label}
        </span>
        {isClickable && <FilterIconClose />}
      </button>
    </li>
  );
};
