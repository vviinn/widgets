import { DynamicFilterValue } from "../../../campaign/VPRCampaignService";
import { Interval } from "../../../interfaces";

export const extractFilterValue = (filterValue: DynamicFilterValue) =>
  filterValue.interval ?? filterValue.value ?? filterValue;

export const valueToString = (val: unknown): string | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && "value" in val) {
    return valueToString((val as { value: unknown }).value);
  }
  return String(val);
};

export const isIntervalMatch = (a: unknown, b: unknown): boolean => {
  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const intervalA = a as Interval;
  const intervalB = b as Interval;

  return intervalA.start === intervalB.start && intervalA.end === intervalB.end;
};

export const isValueMatch = (
  requestValue: unknown,
  filterValue: DynamicFilterValue,
): boolean => {
  const isDirectMatch = requestValue === filterValue;
  const isIntervalFilterMatch =
    filterValue.interval !== undefined &&
    isIntervalMatch(requestValue, filterValue.interval);
  const isComplexValueMatch =
    filterValue.value !== undefined && requestValue === filterValue.value;

  return isDirectMatch || isIntervalFilterMatch || isComplexValueMatch;
};
