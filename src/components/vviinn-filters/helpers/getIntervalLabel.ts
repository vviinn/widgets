import { Interval, ResponseIntervalFilterItem } from "../../..//interfaces";
import { isPriceFilter } from "../../../filters";

export const getIntervalLabel = (
  intervalFilter: ResponseIntervalFilterItem,
  fullInterval: Interval,
  currencySign?: string,
  showColumnLabel: boolean = false,
): string | null => {
  if (!fullInterval) return null;
  const { start, end } = fullInterval;
  const { start: rangeStart, end: rangeEnd } = intervalFilter.full;

  if (start !== rangeStart || end !== rangeEnd) {
    const isPrice = isPriceFilter(intervalFilter.column);
    if (isPrice && currencySign) {
      return `${start} ${currencySign} – ${end} ${currencySign}`;
    } else {
      const rangeValue = `${start} – ${end}`;
      return isPrice
        ? rangeValue
        : `${showColumnLabel ? `${intervalFilter.label}: ` : ""}${rangeValue}`;
    }
  } else {
    return null;
  }
};
