import { h, JSX } from "@stencil/core";
import {
  getRemoveFilterAriaLabel,
  getColorOptionAriaLabel,
} from "../../../a11y";

import { FilterIconCheck, FilterIconClose } from "../../vviinn-icons";
import {
  DynamicFilterValue,
  ResponseDynamicFilterItem,
} from "../../../campaign/VPRCampaignService";

type RenderButtonProps = {
  handleSubFilterSelection: (
    filterValue: DynamicFilterValue,
    selectedFilter: ResponseDynamicFilterItem,
  ) => void;
  value: DynamicFilterValue;
  label: string;
  active: boolean;
  selectedFilter: ResponseDynamicFilterItem;
  isSelected?: boolean;
  showClose?: boolean;
};

export const RenderFilterButton = ({
  handleSubFilterSelection,
  value,
  label,
  active,
  selectedFilter,
  isSelected = false,
  showClose = false,
}: RenderButtonProps): JSX.Element => {
  const hexCode = value?.hexCode;
  const hasHexCodeLength = hexCode?.length > 0;
  const isRemovable = isSelected && showClose;

  const renderIcon = (): JSX.Element => {
    if (isRemovable) {
      return <FilterIconClose />;
    }

    return (
      <div
        part="filters-option-icon-wrapper"
        class="filters-option-icon-wrapper"
        aria-hidden="true"
      >
        {isSelected ? <FilterIconCheck /> : null}
      </div>
    );
  };

  const ariaLabel = isRemovable
    ? getRemoveFilterAriaLabel(label)
    : hasHexCodeLength
      ? getColorOptionAriaLabel(label)
      : undefined;

  return (
    <li part="filters-sub-row">
      <button
        onClick={() => handleSubFilterSelection(value, selectedFilter)}
        class={`filters-more-modal-button ${
          hasHexCodeLength ? "filters-sub-button-color" : ""
        } ${isSelected ? "active" : ""}`}
        disabled={!active && !isSelected}
        part="filters-option-button"
        aria-pressed={!isRemovable && isSelected ? "true" : "false"}
        {...(ariaLabel && { "aria-label": ariaLabel })}
        type="button"
      >
        {hasHexCodeLength && (
          <div
            class="filters-sub-button-color-dot"
            style={{ backgroundColor: hexCode }}
            part="filters-option-color-dot"
            aria-hidden="true"
          ></div>
        )}
        {!hasHexCodeLength && <span part="filters-option-text">{label}</span>}
        {renderIcon()}
      </button>
    </li>
  );
};
