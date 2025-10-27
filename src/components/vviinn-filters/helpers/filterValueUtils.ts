import { DynamicFilterValue } from "../../../campaign/VPRCampaignService";

export const extractFilterValue = (
  filterValue: DynamicFilterValue,
): unknown => {
  return filterValue.interval ?? filterValue.value ?? filterValue;
};

export const valueToString = (val: unknown): string | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && val !== null && "value" in val) {
    return String((val as { value: unknown }).value);
  }
  return String(val);
};

export const isValueMatch = (
  requestValue: unknown,
  filterValue: DynamicFilterValue,
): boolean => {
  if (requestValue === filterValue) return true;

  // Check interval match (for interval filters)
  if (
    filterValue.interval !== undefined &&
    requestValue === filterValue.interval
  ) {
    return true;
  }

  // Check value property match (for color filters and other complex objects)
  if (filterValue.value !== undefined && requestValue === filterValue.value) {
    return true;
  }

  return false;
};
