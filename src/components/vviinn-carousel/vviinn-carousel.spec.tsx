// Swiper ships ESM only, which Jest 27 can't parse; Stencil's transformer doesn't hoist
// jest.mock, so it has to precede the component import.
jest.mock("swiper/modules", () => ({ Pagination: {} }));
jest.mock("swiper/element", () => ({ register: jest.fn() }));

import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { VviinnCarousel } from "./vviinn-carousel";
import { VviinnProductCard } from "../vviinn-product-card/vviinn-product-card";
import type { Recommendation } from "../../interfaces/product";

class NoopObserver {
  observe() {}
  disconnect() {}
}
Object.assign(globalThis, {
  ResizeObserver: NoopObserver,
  MutationObserver: NoopObserver,
});

const recommendation = (i: number) =>
  ({
    productId: `p${i}`,
    title: `Product ${i}`,
    deeplink: `https://shop.test/p${i}`,
    price: { actual: 100 },
  }) as Recommendation;

const renderSet = async (count = 12) => {
  const page = await newSpecPage({
    components: [VviinnCarousel, VviinnProductCard],
    html: `<div></div>`,
  });
  const carousel = page.doc.createElement("vviinn-carousel");
  Object.assign(carousel, {
    mode: "set",
    setItemsAmount: 4,
    recommendations: Array.from({ length: count }, (_, i) => recommendation(i)),
    sourceProduct: recommendation(99),
    setModeDiscountsArray: [5, 10, 15],
    replaceSlotsContent: () => {},
  });
  // The carousel sizes itself from the widget hosting it in a shadow root.
  page.body
    .querySelector("div")
    .attachShadow({ mode: "open" })
    .appendChild(carousel);
  await page.waitForChanges();
  return { page, carousel };
};

// The source product card leads the set; the slots follow it.
const slots = (carousel: HTMLElement) =>
  Array.from(
    carousel.querySelectorAll<HTMLVviinnProductCardElement>(
      "vviinn-product-card:not(.product-card--source)",
    ),
  ).map((card) => `${card.productId}:${card.index}`);

const refresh = async (
  page: SpecPage,
  carousel: HTMLElement,
  productId: string,
) => {
  carousel.dispatchEvent(
    new CustomEvent("vviinnCrossSellingClick", {
      detail: { animationInterval: 0, productData: { productId } },
    }),
  );
  await page.waitForChanges();
};

describe("rank in set mode", () => {
  it("is the product's index in the recommendations", async () => {
    const { carousel } = await renderSet();

    expect(slots(carousel)).toEqual(["p0:0", "p1:1", "p2:2", "p3:3"]);
  });

  it("follows the product a slot refreshes to", async () => {
    const { page, carousel } = await renderSet();

    await refresh(page, carousel, "p1");

    expect(slots(carousel)).toEqual(["p0:0", "p5:5", "p2:2", "p3:3"]);
  });

  it("follows each slot on a new set after a single refresh", async () => {
    const { page, carousel } = await renderSet();
    await refresh(page, carousel, "p1");

    carousel.updatingAllCards = true;
    await page.waitForChanges();

    expect(slots(carousel)).toEqual(["p4:4", "p9:9", "p6:6", "p7:7"]);
  });
});
