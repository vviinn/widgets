import { h } from "@stencil/core";

import {
  CheckFilterIcon,
  CloseFilterIcon,
  SquareFilterIcon,
} from "../../vviinn-icons";

export const RenderButton = (
  handleSubFilterSelection,
  value,
  label,
  active,
  selectedFilter,
  isSelected = false,
  showClose = false
) => {
  const hexCode = value.hexCode;
  const hasHexCodeLength = hexCode?.length > 0;

  return (
    <li part="extended-filters-sub-row">
      <button
        onClick={() => handleSubFilterSelection(value, selectedFilter)}
        class={`filters-more-modal-button ${
          hasHexCodeLength ? "filters-sub-button-color" : ""
        } ${isSelected ? "active" : ""}`}
        disabled={!active}
        part="extended-filters-option-button"
      >
        {hasHexCodeLength && (
          <div
            class="filters-sub-button-color-dot"
            style={{ backgroundColor: hexCode }}
            part="extended-filters-option-color-dot"
          ></div>
        )}
        <span>
          <span part="extended-filters-option-text">{label}</span>
          <div part="extended-filters-option-icon-wrapper">
            {!showClose ? (
              isSelected ? (
                <CheckFilterIcon />
              ) : (
                <SquareFilterIcon />
              )
            ) : null}
          </div>
          {isSelected && showClose && <CloseFilterIcon />}
        </span>
      </button>
    </li>
  );
};
