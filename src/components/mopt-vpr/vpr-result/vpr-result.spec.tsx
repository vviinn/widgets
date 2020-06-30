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

  it('renders recommendation with thumbnail', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <span>Fender Jazz Bass</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders recommendation title as span if no deeplink', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <span>Fender Jazz Bass</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders recommendation title as span if deeplink is empty string', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: ''
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <span>Fender Jazz Bass</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders link if non-empty deeplink present', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html'
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <a href="/basses/fjb.html">Fender Jazz Bass</a>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders price (only actual presented)', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html',
      price: {
        actual: 100
      }
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <a href="/basses/fjb.html">Fender Jazz Bass</a>
          <span class="price">100</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders price (only retail presented)', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html',
      price: {
        retail: 100
      }
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <a href="/basses/fjb.html">Fender Jazz Bass</a>
          <span class="price">100</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders price (retail eq actual)', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html',
      price: {
        retail: 100,
        actual: 100
      }
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <a href="/basses/fjb.html">Fender Jazz Bass</a>
          <span class="price">100</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders price (actual more then retail)', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html',
      price: {
        retail: 90,
        actual: 100
      }
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <a href="/basses/fjb.html">Fender Jazz Bass</a>
          <span class="price">100</span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders price (retail more then actual)', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html',
      price: {
        retail: 100,
        actual: 90
      }
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
          <img alt="Fender Jazz Bass" height="150" src="path-to-thumb.jpg" width="100">
          <a href="/basses/fjb.html">Fender Jazz Bass</a>
          <div class="sale-container">
            <span class="price outdated">100</span>
            <span class="price discount">90</span>
          </div>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

});
