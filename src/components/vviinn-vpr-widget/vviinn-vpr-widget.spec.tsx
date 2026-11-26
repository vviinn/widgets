// Swiper ships ESM only, which Jest 27 can't parse; Stencil's transformer doesn't hoist
// jest.mock, so it has to precede the component import.
jest.mock("swiper/modules", () => ({ Pagination: {} }));
jest.mock("swiper/element", () => ({ register: jest.fn() }));

import { newSpecPage } from "@stencil/core/testing";
import { VviinnVprWidget } from "./vviinn-vpr-widget";

type WithResponse = {
  handleRecommendationsSuccess: (response: unknown) => void;
};

const respond = (widget: unknown, productIds: string[]) =>
  (widget as WithResponse).handleRecommendationsSuccess({
    data: { products: productIds.map((productId) => ({ productId })) },
    interactions: { dynamicFilters: [] },
  });

it("reports the recommendations loaded once per response", async () => {
  const page = await newSpecPage({
    components: [VviinnVprWidget],
    html: `<vviinn-vpr-widget></vviinn-vpr-widget>`,
  });
  respond(page.rootInstance, ["a"]);
  respond(page.rootInstance, ["b"]);
  let loaded = 0;
  page.root.addEventListener("vviinnRecommendationsLoaded", () => loaded++);

  page.root.dispatchEvent(
    new CustomEvent("vviinnProductLoad", { detail: { productId: "b" } }),
  );

  expect(loaded).toBe(1);
});
