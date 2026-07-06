import { ResponseDynamicFilterItem } from "../../../interfaces";

const MODALITY_COLUMN = "modality";
const OCR_VALUE = "OCR";

export const hasSelectedOcrFilter = (
  dynamicFilters: ResponseDynamicFilterItem[] | undefined,
): boolean =>
  !!dynamicFilters?.some((filter) => {
    if (filter.type !== "categorical" || !("values" in filter)) return false;
    if (filter.column !== MODALITY_COLUMN) return false;

    return filter.values.some(
      (value) => value.value === OCR_VALUE && value.selected === true,
    );
  });
