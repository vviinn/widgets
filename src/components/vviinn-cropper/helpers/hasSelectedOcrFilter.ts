import { ResponseDynamicFilterItem } from "../../../interfaces";
import { extractSelectedFilters } from "../../vviinn-filters/helpers";

const MODALITY_COLUMN = "modality";
const OCR_VALUE = "OCR";

export const hasSelectedOcrFilter = (
  dynamicFilters: ResponseDynamicFilterItem[] | undefined,
): boolean =>
  extractSelectedFilters(dynamicFilters ?? []).some(
    (filter) =>
      filter.column === MODALITY_COLUMN && filter.values.includes(OCR_VALUE),
  );
