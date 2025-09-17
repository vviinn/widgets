import { h } from "@stencil/core";
import { SearchIcon } from "../../vviinn-icons";

export interface RenderSearchInputProps {
  searchTerm: string;
  onSearchInput: (searchTerm: string) => void;
  placeholder?: string;
  iconSlot?: any;
}

export const RenderSearchInput = ({
  searchTerm,
  onSearchInput,
  placeholder = "Start Search...",
  iconSlot,
}: RenderSearchInputProps) => (
  <div
    class="filters-search-input-container"
    part="filters-search-input-container"
  >
    <div class="filters-search-icon" part="filters-search-icon">
      <slot name="vviinn-filters-search-icon">
        {iconSlot || <SearchIcon />}
      </slot>
    </div>
    <input
      type="text"
      placeholder={placeholder}
      class="filters-search-input"
      part="filters-search-input"
      value={searchTerm}
      onInput={(e) => onSearchInput((e.target as HTMLInputElement).value)}
    />
  </div>
);
