import { LabelValueItem } from "../../../interfaces";

export const filterOptionsBySearch = (
  filterOptions: LabelValueItem[],
  searchTerm: string
): LabelValueItem[] => {
  if (!searchTerm.trim()) return filterOptions;
  
  const normalizedSearch = searchTerm.toLowerCase().trim();
  return filterOptions.filter(({ label }) => 
    label.toLowerCase().includes(normalizedSearch)
  );
};