import { newSpecPage } from '@stencil/core/testing';
import { VprResult } from './vpr-result';

describe('vpr-result', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VprResult],
      html: `<vpr-result></vpr-result>`,
    });
    expect(page.root).toEqualHtml(`
      <vpr-result>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </vpr-result>
    `);
  });
});
