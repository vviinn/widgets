import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import { extractActiveFilterValues } from "./helpers";

it("keys categorical request values as column:value", () => {
  const filters = [
    { column: "brand", values: ["Vito", "JOOP"] },
  ] as unknown as RequestDynamicFilterItem[];

  const keys = extractActiveFilterValues(filters);

  expect(keys.has("brand:Vito")).toBe(true);
  expect(keys.has("brand:JOOP")).toBe(true);
});

it("keys interval request values as column:start-end (not [object Object])", () => {
  const filters = [
    { column: "price", values: [{ start: 100, end: 200 }] },
  ] as unknown as RequestDynamicFilterItem[];

  const keys = extractActiveFilterValues(filters);

  expect(keys.has("price:100-200")).toBe(true);
  expect(keys.has("price:[object Object]")).toBe(false);
});
