import { newSpecPage, SpecPage } from "@stencil/core/testing";
import { VprResult } from "./vpr-result";
import { Interfaces } from "../../../interfaces/recommendation";

let page: SpecPage;

describe("vpr-result", () => {
  beforeEach(async () => {
    global.IntersectionObserver = jest.fn(() => ({
      takeRecords: jest.fn(),
      root: null,
      rootMargin: "0",
      thresholds: [1],
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

    page = await newSpecPage({
      components: [VprResult],
      html: `<vpr-result></vpr-result>`,
    });
  });

  it("renders", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
      },
      title: "Fender Jazz Bass",
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" part="product-image" height="100" src="path-to-image.jpg" width="100">
          <span class="product title" part="product-title" title="Fender Jazz Bass">
            Fender Jazz Bass
          </span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it("renders recommendation with thumbnail", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
    };

    await page.setContent("<vpr-result></vpr-result>");

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          <span class="product title" part="product-title" title="Fender Jazz Bass">
            Fender Jazz Bass
          </span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it("renders recommendation title as span if no deeplink", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          <span class="product title" part="product-title" title="Fender Jazz Bass">
            Fender Jazz Bass
          </span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it("renders recommendation title as span if deeplink is empty string", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "",
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          <span class="product title" part="product-title" title="Fender Jazz Bass">
            Fender Jazz Bass
          </span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it("renders link if non-empty deeplink present", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
            Fender Jazz Bass
          </a>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it("renders price (only actual presented)", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
      price: {
        actual: 100,
      },
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
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

  it("renders price (only sale presented)", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
      price: {
        sale: 100,
      },
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
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

  it("renders price (sale eq actual)", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
      price: {
        sale: 100,
        actual: 100,
      },
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
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

  it("renders price (actual more then sale)", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
      price: {
        sale: 90,
        actual: 100,
      },
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
            Fender Jazz Bass
          </a>
          <span class="outdated price" part="price-outdated">
            <span class="amount price" part="price-amount">
              100
            </span>
          </span>
          <span class="discount price" part="price-discount">
            <span class="amount price" part="price-amount">
              90
            </span>
          </span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it("renders price (sale more then actual)", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
      price: {
        sale: 100,
        actual: 90,
      },
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
            Fender Jazz Bass
          </a>
          <span class="price regular" part="price-regular">
            <span class="amount price" part="price-amount">
              90
            </span>
          </span>
        </mock:shadow-root>
      </vpr-result>
    `);
  });

  it("renders brand", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
      price: {
        actual: 100,
      },
      brand: "Fender",
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
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

  it("renders product type", async () => {
    const recommendation: Interfaces["VisualProductSearch"] = {
      productId: "some-id",
      image: {
        original: "path-to-image.jpg",
        thumbnail: "path-to-thumb.jpg",
      },
      title: "Fender Jazz Bass",
      deeplink: "/basses/fjb.html",
      price: {
        actual: 100,
      },
      productType: "Bass guitar",
    };

    page.root.item = recommendation;
    await page.waitForChanges();

    expect(page.root).toEqualHtml(`
      <vpr-result exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type" part="product" style="--image-height: 100px; --image-ratio: 1">

        <mock:shadow-root>
          <style></style>
          <a href="/basses/fjb.html" part="product-image-link">
            <img alt="Fender Jazz Bass" part="product-image" height="100" src="path-to-thumb.jpg" width="100">
          </a>
          <a class="product title" href="/basses/fjb.html" part="product-title" title="Fender Jazz Bass">
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
