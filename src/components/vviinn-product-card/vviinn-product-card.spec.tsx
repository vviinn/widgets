// Swiper ships ESM only, which Jest 27 can't parse; Stencil's transformer doesn't hoist
// jest.mock, so it has to precede the component import.
jest.mock("swiper/modules", () => ({ Pagination: {} }));
jest.mock("swiper/element", () => ({ register: jest.fn() }));

import { newSpecPage } from "@stencil/core/testing";
import { VviinnProductCard } from "./vviinn-product-card";

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
