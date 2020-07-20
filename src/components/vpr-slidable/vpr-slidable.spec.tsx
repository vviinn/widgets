import { newSpecPage } from '@stencil/core/testing';
import { VprSlidable } from './vpr-slidable';

describe('vpr-slidable', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VprSlidable],
      html: `<vpr-slidable></vpr-slidable>`,
    });
    expect(page.root).toEqualHtml(`
      <vpr-slidable>
        <mock:shadow-root>
          <slider-mouse>
            <slot></slot>
          </slider-mouse>
        </mock:shadow-root>
      </vpr-slidable>
    `);
  });
});
