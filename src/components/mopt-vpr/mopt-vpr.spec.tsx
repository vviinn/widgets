import { newSpecPage } from '@stencil/core/testing';
import { MoptVpr } from './mopt-vpr';

describe('mopt-vpr', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MoptVpr],
      html: `<mopt-vpr></mopt-vpr>`,
    });
    expect(page.root).toEqualHtml(`
      <mopt-vpr>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mopt-vpr>
    `);
  });
});
