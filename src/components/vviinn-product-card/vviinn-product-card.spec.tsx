// Swiper ships ESM only, which Jest 27 can't parse; Stencil's transformer doesn't hoist
// jest.mock, so it has to precede the component import.
jest.mock("swiper/modules", () => ({ Pagination: {} }));
jest.mock("swiper/element", () => ({ register: jest.fn() }));

const observers = new Set<(isIntersecting: boolean) => void>();
const scrollIntoView = () => observers.forEach((notify) => notify(true));
jest.mock("../../dom/intersectionObserver", () => ({
  ...jest.requireActual("../../dom/intersectionObserver"),
  setupIntersectionObserver: (
    _: Element,
    { onIntersectionChange }: IntersectionObserverConfig,
  ) => {
    observers.add(onIntersectionChange);
    return { disconnect: () => observers.delete(onIntersectionChange) };
  },
}));

import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { VviinnProductCard } from "./vviinn-product-card";
import type { IntersectionObserverConfig } from "../../dom/intersectionObserver";

const renderCard = (html: string) =>
  newSpecPage({ components: [VviinnProductCard], html });

describe.each(["product", "content", "list"])("%s card", (entityType) => {
  it("carries the brand and custom labels as attributes", async () => {
    const page = await renderCard(
      `<vviinn-product-card entity-type="${entityType}" brand="Acme" custom-labels="Sale||||Featured"></vviinn-product-card>`,
    );

    expect(page.root.getAttribute("data-brand")).toBe("Acme");
    expect(page.root.getAttribute("data-custom-label-0")).toBe("Sale");
    expect(page.root.getAttribute("data-custom-label-4")).toBe("Featured");
    expect(page.root.hasAttribute("data-custom-label-1")).toBe(false);
  });
});

it("drops the attributes when the brand and labels are cleared", async () => {
  const page = await renderCard(
    `<vviinn-product-card brand="Acme" custom-labels="Sale||||"></vviinn-product-card>`,
  );
  expect(page.root.getAttribute("data-brand")).toBe("Acme");

  page.root.brand = undefined;
  page.root.customLabels = "";
  await page.waitForChanges();

  expect(page.root.hasAttribute("data-brand")).toBe(false);
  expect(page.root.hasAttribute("data-custom-label-0")).toBe(false);
});

describe("a card reused for another product", () => {
  beforeEach(() => observers.clear());

  const renderTrackedCard = async (
    markup = `<vviinn-product-card product-id="a" product-title="A"></vviinn-product-card>`,
  ) => {
    const page = await renderCard(markup);
    const loads: string[] = [];
    const views: string[] = [];
    page.root.addEventListener("vviinnProductLoad", (e: CustomEvent) =>
      loads.push(`${e.detail.productId}:${e.detail.productName}`),
    );
    page.root.addEventListener("vviinnProductView", (e: CustomEvent) =>
      views.push(e.detail.productId),
    );
    return { page, loads, views };
  };

  // vviinn-image isn't registered here, so its image load is played by hand.
  const loadImage = (page: SpecPage) =>
    page.root.shadowRoot
      .querySelector("vviinn-image")
      .imageRef(page.doc.createElement("img"));

  it("reports the load of the new product with its new data", async () => {
    const { page, loads } = await renderTrackedCard();

    page.root.productId = "b";
    page.root.productTitle = "B";
    await page.waitForChanges();

    expect(loads).toEqual(["b:B"]);
  });

  it("reports the first real product of a card rendered without one", async () => {
    const { page, loads } = await renderTrackedCard(
      `<vviinn-product-card product-id="" product-title=""></vviinn-product-card>`,
    );

    page.root.productId = "b";
    page.root.productTitle = "B";
    await page.waitForChanges();

    expect(loads).toEqual(["b:B"]);
  });

  it("reports nothing when only other props change", async () => {
    const { page, loads } = await renderTrackedCard();

    page.root.productTitle = "A2";
    await page.waitForChanges();

    expect(loads).toEqual([]);
  });

  it("watches the new product's visibility", async () => {
    const { page, views } = await renderTrackedCard();
    loadImage(page);
    scrollIntoView();

    page.root.productId = "b";
    await page.waitForChanges();
    scrollIntoView();

    expect(views).toEqual(["a", "b"]);
  });

  it("watches a product swapped into a set once the transition ends", async () => {
    const { page, views } = await renderTrackedCard(
      `<vviinn-product-card is-set-mode product-id="a"></vviinn-product-card>`,
    );
    loadImage(page);
    scrollIntoView();

    page.root.dispatchEvent(
      new CustomEvent("vviinnCrossSellingClick", {
        detail: { animationInterval: 10 },
      }),
    );
    page.root.productId = "b";
    await page.waitForChanges();
    scrollIntoView();
    expect(views).toEqual(["a"]);

    await new Promise((resolve) => setTimeout(resolve, 20));
    await page.waitForChanges();
    scrollIntoView();
    expect(views).toEqual(["a", "b"]);
  });
});

it("sends the current rank once the card moves to another position", async () => {
  const page = await renderCard(
    `<vviinn-product-card add-to-basket-show product-id="a" index="3"></vviinn-product-card>`,
  );
  const ranks: number[] = [];
  page.root.addEventListener("vviinnAddToBasket", (e: CustomEvent) =>
    ranks.push(e.detail.productRank),
  );

  page.root.index = 0;
  await page.waitForChanges();
  page.root.shadowRoot.querySelector<HTMLElement>(".basket-button").click();

  expect(ranks).toEqual([0]);
});

it("tracks a click on the title of a product swapped into a set", async () => {
  const page = await renderCard(
    `<vviinn-product-card is-set-mode product-id="a" product-title="A" deeplink="https://shop.test/a"></vviinn-product-card>`,
  );
  const clicks: string[] = [];
  page.root.addEventListener("vviinnProductClick", (e: CustomEvent) =>
    clicks.push(e.detail.productId),
  );

  page.root.dispatchEvent(
    new CustomEvent("vviinnCrossSellingClick", {
      detail: { animationInterval: 10 },
    }),
  );
  page.root.productId = "b";
  page.root.deeplink = "https://shop.test/b";
  await page.waitForChanges();
  await new Promise((resolve) => setTimeout(resolve, 20));
  await page.waitForChanges();
  page.root.shadowRoot.querySelector<HTMLElement>("a.deeplink").click();

  expect(clicks).toEqual(["b"]);
});
