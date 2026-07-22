import {
  RequestDynamicFilterItem,
  ResponseDynamicFilterItem,
} from "../../../interfaces";
import { extractSelectedFilters } from "../../vviinn-filters/helpers";

const MODALITY_COLUMN = "modality";
const OCR_VALUE = "OCR";

const selectsOcr = (filters: RequestDynamicFilterItem[]): boolean =>
  filters.some(
    (filter) =>
      filter.column === MODALITY_COLUMN && filter.values.includes(OCR_VALUE),
  );

/** True when the response's dynamicFilters mark the OCR modality as selected. */
export const hasSelectedOcrFilter = (
  dynamicFilters: ResponseDynamicFilterItem[] | undefined,
): boolean => selectsOcr(extractSelectedFilters(dynamicFilters ?? []));

/**
 * True when the outgoing requestFilters carry the OCR modality. Unlike the
 * response echo, this reflects the user's choice stably — a region-restricted
 * search may not echo OCR back as selected.
 */
export const requestHasOcrFilter = (
  requestFilters: RequestDynamicFilterItem[] | undefined,
): boolean => selectsOcr(requestFilters ?? []);
