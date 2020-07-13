import { newSpecPage } from '@stencil/core/testing';
import { MoptVpr } from './mopt-vpr';

describe('mopt-vpr', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MoptVpr],
      html: `<mopt-vpr></mopt-vpr>`,
    });
    expect(page.root).toEqualHtml(`
      <mopt-vpr aria-hidden="true" style="--column-width: 150px;">
        <mock:shadow-root>
          <style></style>
          <h2 part="recommendations-title">
            Recommended products
          </h2>
          <div class="results" data-columns="4"></div>
          <div class="visually-hidden" part="shadow-parts-detect"></div>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });
});
