import { newSpecPage } from '@stencil/core/testing';
import { VprResult } from './vpr-result';
import { Interfaces } from '../../../interfaces/recommendation';

describe('vpr-result', () => {
  it('renders', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg'
      },
      title: 'Fender Jazz Bass'
    };
    
    const page = await newSpecPage({
      components: [VprResult],
      html: `<vpr-result></vpr-result>`
    });

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result style="--image-height: 150px;">
        <mock:shadow-root>
          <img alt="Fender Jazz Bass" height="150" src="path-to-image.jpg" width="100">
          <span>Fender Jazz Bass</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });
});
