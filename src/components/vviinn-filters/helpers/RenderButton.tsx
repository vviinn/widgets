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
          ></div>
        )}
        <span>
          <span>{label}</span>
          {!showClose ? (
            isSelected ? (
              <CheckFilterIcon />
            ) : (
              <SquareFilterIcon />
            )
          ) : null}
          {isSelected && showClose && <CloseFilterIcon />}
        </span>
      </button>
    </li>
  );
};
