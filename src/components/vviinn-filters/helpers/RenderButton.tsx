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

  return (
    <li>
      <button
        class={`filters-sub-button${isSelected ? "-selected" : ""} ${
          hexCode ? "filters-sub-button-color" : ""
        } ${isSelected ? "active" : ""}`}
        style={{ backgroundColor: hexCode }}
        onClick={() => {
          active || isSelected
            ? handleSubFilterSelection(value, selectedFilter)
            : null;
        }}
        disabled={!(active || isSelected)}
        part="filters-sub-button"
      >
        <span>
          <span>{label}</span>
          {!showClose ? (
            isSelected ? (
              <CheckFilterIcon />
            ) : (
              <SquareFilterIcon />
            )
          ) : null}
        </span>
      </button>
      {isSelected && showClose && <CloseFilterIcon />}
    </li>
  );
};
