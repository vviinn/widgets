import { ResponseIntervalFilterItem } from "../../../interfaces/search";
import { isPriceFilter } from "../../../filters";

export const getIntervalLabel = (
  intervalFilter: ResponseIntervalFilterItem,
  fullInterval: ResponseIntervalFilterItem["full"],
  currencySign?: string,
): string | null => {
  if (!fullInterval) return null;
  const { start, end } = fullInterval;
  const { start: rangeStart, end: rangeEnd } = intervalFilter.full;

  if (start !== rangeStart || end !== rangeEnd) {
    const isPrice = isPriceFilter(intervalFilter.column);
    if (isPrice && currencySign) {
      return `${start} ${currencySign} – ${end} ${currencySign}`;
    } else {
      return `${start} – ${end}`;
    }
  } else {
    return null;
  }
};
