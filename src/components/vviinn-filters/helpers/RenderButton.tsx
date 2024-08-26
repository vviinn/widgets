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
    <li
      onClick={() =>
        active ? handleSubFilterSelection(value, selectedFilter) : null
      }
    >
      <button
        class={`filters-sub-button${isSelected ? "-selected" : ""} ${
          hexCode ? "filters-sub-button-color" : ""
        } ${isSelected ? "active" : ""}`}
        style={{ backgroundColor: hexCode }}
        disabled={!active}
      >
        <span>
          {!isSelected ? label : <span>{label}</span>}
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
