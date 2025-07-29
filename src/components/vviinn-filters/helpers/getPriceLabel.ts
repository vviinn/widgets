import { ResponseIntervalFilterItem } from "../../../interfaces/search";

export const getPriceLabel = (
  intervalFilter: ResponseIntervalFilterItem,
  fullInterval: ResponseIntervalFilterItem["full"],
  currencySign: string,
): string | null => {
  if (!fullInterval) return null;
  const { start, end } = fullInterval;
  const { start: rangeStart, end: rangeEnd } = intervalFilter.full;

  if (start !== rangeStart || end !== rangeEnd) {
    return `${start} ${currencySign} – ${end} ${currencySign}`;
  } else {
    return null;
  }
};
