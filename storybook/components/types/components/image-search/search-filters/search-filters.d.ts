import { SearchSessionFilter } from "../../../searchSession/searchSession";
export declare class SearchFilters {
  el: HTMLElement;
  filter: SearchSessionFilter | null;
  selectedCategoryId: string | null;
  hideFilters: boolean;
  private handleFilterSelection;
  private selectFilter;
  private clearSelectedFilter;
  private findSelectedFilter;
  private toggleFilters;
  private handleEnter;
  private isFilterSelected;
  render(): any;
}
