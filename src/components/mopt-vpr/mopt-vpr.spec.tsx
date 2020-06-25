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
          <h4>
            Recommended products
          </h4>
          <div class="results" data-columns="4"></div>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });
});
