import { newSpecPage } from '@stencil/core/testing';
import { MoptVpr } from './mopt-vpr';

describe('mopt-vpr', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MoptVpr],
      html: `<mopt-vpr></mopt-vpr>`,
    });
    expect(page.root).toEqualHtml(`
      <mopt-vpr aria-hidden="true" style="--column-width: 187.5px; --columns: 4;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="grid results" data-columns="4"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });

  it('renders with price attribute', async () => {
    const page = await newSpecPage({
      components: [MoptVpr],
      html: `<mopt-vpr product-id="0100580000053" token="lol"></mopt-vpr>`,
    });
    expect(page.root).toEqualHtml(`
      <mopt-vpr aria-hidden="true" product-id="0100580000053" token="lol" style="--column-width: 187.5px; --columns: 4;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="grid results" data-columns="4"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });
});
