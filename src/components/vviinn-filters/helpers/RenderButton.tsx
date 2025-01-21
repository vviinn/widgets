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
  showClose = false,
) => {
  const hexCode = value.hexCode;
  const hasHexCodeLength = hexCode?.length > 0;

  return (
    <li part="filters-sub-row">
      <button
        onClick={() => handleSubFilterSelection(value, selectedFilter)}
        class={`filters-more-modal-button ${
          hasHexCodeLength ? "filters-sub-button-color" : ""
        } ${isSelected ? "active" : ""}`}
        disabled={!active && !isSelected}
        part="filters-option-button"
      >
        {hasHexCodeLength && (
          <div
            class="filters-sub-button-color-dot"
            style={{ backgroundColor: hexCode }}
            part="filters-option-color-dot"
          ></div>
        )}
        <span>
          <span part="filters-option-text">{label}</span>
          <div part="filters-option-icon-wrapper">
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
