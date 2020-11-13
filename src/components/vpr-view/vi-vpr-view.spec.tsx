import { newSpecPage } from "@stencil/core/testing";
import { VIVprView } from "./vi-vpr-view";

describe("vi-vpr-view", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [VIVprView],
      html: `<vi-vpr-view></vi-vpr-view>`,
    });
    expect(page.root).toEqualHtml(`
      <vi-vpr-view aria-hidden="true" exportparts="grid" style="--column-width: 150px;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="results" data-mode="auto" part="grid"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </vi-vpr-view>
    `);
  });

  it("renders with price attribute", async () => {
    const page = await newSpecPage({
      components: [VIVprView],
      html: `<vi-vpr-view product-id="0100580000053" token="lol"></vi-vpr-view>`,
    });
    expect(page.root).toEqualHtml(`
      <vi-vpr-view aria-hidden="true" exportparts="grid" product-id="0100580000053" token="lol" style="--column-width: 150px;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="results" data-mode="auto" part="grid"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </vi-vpr-view>
    `);
  });

  it("renders proper columns and mode attributes attribute", async () => {
    const page = await newSpecPage({
      components: [VIVprView],
      html: `<vi-vpr-view product-id="0100580000053" token="lol" columns="4"></vi-vpr-view>`,
    });
    expect(page.root).toEqualHtml(`
      <vi-vpr-view aria-hidden="true" columns="4" exportparts="grid" product-id="0100580000053" token="lol" style="--columns: 4; --column-width: 150px;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="results" data-mode="grid" part="grid"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </vi-vpr-view>
    `);
  });
});
