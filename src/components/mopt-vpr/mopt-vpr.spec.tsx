import { newSpecPage } from "@stencil/core/testing";
import { MoptVpr } from "./mopt-vpr";

describe("mopt-vpr", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [MoptVpr],
      html: `<mopt-vpr></mopt-vpr>`,
    });
    expect(page.root).toEqualHtml(`
      <mopt-vpr aria-hidden="true" exportparts="grid" style="--column-width: 150px;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="results" data-mode="auto" part="grid"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });

  it("renders with price attribute", async () => {
    const page = await newSpecPage({
      components: [MoptVpr],
      html: `<mopt-vpr product-id="0100580000053" token="lol"></mopt-vpr>`,
    });
    expect(page.root).toEqualHtml(`
      <mopt-vpr aria-hidden="true" exportparts="grid" product-id="0100580000053" token="lol" style="--column-width: 150px;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="results" data-mode="auto" part="grid"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });

  it("renders proper columns and mode attributes attribute", async () => {
    const page = await newSpecPage({
      components: [MoptVpr],
      html: `<mopt-vpr product-id="0100580000053" token="lol" columns="4"></mopt-vpr>`,
    });
    expect(page.root).toEqualHtml(`
      <mopt-vpr aria-hidden="true" columns="4" exportparts="grid" product-id="0100580000053" token="lol" style="--columns: 4; --column-width: 150px;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="results" data-mode="grid" part="grid"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });
});
