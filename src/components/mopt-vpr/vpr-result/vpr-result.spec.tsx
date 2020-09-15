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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" part="product-image" height="150" src="path-to-image.jpg" width="100">
          <span class="product title" part="product-title">
            Fender Jazz Bass
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          <span class="product title" part="product-title">
            Fender Jazz Bass
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          <span class="product title" part="product-title">
            Fender Jazz Bass
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          <span class="product title" part="product-title">
            Fender Jazz Bass
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
          <span class="price regular" part="price-regular">
            <span class="amount price" part="price-amount">
              100
            </span>
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
          <span class="price regular" part="price-regular">
            <span class="amount price" part="price-amount">
              100
            </span>
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
          <span class="price regular" part="price-regular">
            <span class="amount price" part="price-amount">
              100
            </span>
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
          <span class="price regular" part="price-regular">
            <span class="amount price" part="price-amount">
              100
            </span>
          </span>
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
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
          <div class="sale-container">
            <span class="price outdated" part="price-outdated">
              <span class="amount price" part="price-amount">
                100
              </span>
            </span>
            <span class="discount price" part="price-discount">
              <span class="amount price" part="price-amount">
                90
              </span>
            </span>
          </div>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it('renders brand', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html',
      price: {
        actual: 100
      },
      brand: "Fender"
    };
    
    const page = await newSpecPage({
      components: [VprResult],
      html: `<vpr-result></vpr-result>`
    });

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
          <span class="brand" part="brand">Fender</span>
          <span class="price regular" part="price-regular">
            <span class="amount price" part="price-amount">100</span>
          </span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

    it('renders product type', async () => {
    const recommendation: Interfaces['VisualProductSearch'] = {
      image: {
        original: 'path-to-image.jpg',
        thumbnail: 'path-to-thumb.jpg'
      },
      title: 'Fender Jazz Bass',
      deeplink: '/basses/fjb.html',
      price: {
        actual: 100
      },
      productType: "Bass guitar"
    };
    
    const page = await newSpecPage({
      components: [VprResult],
      html: `<vpr-result></vpr-result>`
    });

    page.root.item = recommendation;
    await page.waitForChanges();

      expect(page.root).toEqualHtml(`
      <vpr-result exportparts="price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, brand, product-type" style="--image-height: 150px;">
        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html">
            <img alt="Fender Jazz Bass" part="product-image" height="150" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title">
            Fender Jazz Bass
          </a>
          <span class="product-type" part="product-type">Bass guitar</span>
          <span class="price regular" part="price-regular">
            <span class="amount price" part="price-amount">100</span>
          </span>
        </mock:shadow-root>
      </vpr-result>
      `);
    });

});
