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
        }`}
        style={{ backgroundColor: hexCode }}
        disabled={!active}
      >
        <span>
          {!isSelected ? label : <span>{label}</span>}{" "}
          {isSelected ? <CheckFilterIcon /> : <SquareFilterIcon />}
        </span>
      </button>
      {isSelected && hexCode && showClose && <CloseFilterIcon />}
    </li>
  );
};
