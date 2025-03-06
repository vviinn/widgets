import { components } from "../../../interfaces/generated";
import { ResponseDynamicFilterIntervalItem } from "../../../interfaces/recommendation";

export const getPriceLabel = (
  intervalFilter: ResponseDynamicFilterIntervalItem,
  interval: components["schemas"]["interval"],
  currencySign: string,
): string | null => {
  if (!interval) return null;
  const { start, end } = interval;
  const { start: rangeStart, end: rangeEnd } = intervalFilter.full;

  if (start !== rangeStart || end !== rangeEnd) {
    return `${start} ${currencySign} – ${end} ${currencySign}`;
  } else {
    return null;
  }
};
