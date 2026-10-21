# vviinn Widgets

[![npm](https://img.shields.io/npm/v/vviinn-widgets)](https://www.npmjs.com/package/vviinn-widgets)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)

> AI-powered search and product discovery widgets for e-commerce storefronts.

Drop a custom element onto a page and it renders a shoppable UI backed by the
[vviinn](https://vviinn.com) Visual Relevance Machine: search by photo, AI text search with
suggestions, "shop the look" hotspots, smart filters, and product recommendations. The
widgets are [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
built with [Stencil](https://stenciljs.com/), so they work in plain HTML, in React, Angular,
Vue and Nuxt, and inside a mobile `WebView`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
- [Public components](#public-components)
- [Ways to integrate](#ways-to-integrate)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Security](#security)
- [Support](#support)
- [License](#license)
- [Name and logo](#name-and-logo)

## Prerequisites

A vviinn **read-only site token** and an imported product feed:

1. [Register](https://panel.vviinn.com/auth/register) or
   [sign in](https://panel.vviinn.com/auth/signin) to the vviinn Panel and complete the
   self-onboarding, which sets up your company, site, campaigns and product feed.
2. Open **Sites**, select the active site, and copy the `Read Only` token.

The read-only token is meant to be shipped in your storefront's HTML.

## Install

### CDN

Add the loader to the `<head>` of your page. The `nomodule` script is only needed for
browsers without ES module support.

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/vviinn-widgets@latest/www/build/vviinn-widgets.esm.js"
></script>
<script
  nomodule
  src="https://cdn.jsdelivr.net/npm/vviinn-widgets@latest/www/build/vviinn-widgets.js"
></script>
```

Pin an exact version instead of `@latest` for production. Releases follow
[semantic versioning](https://docs.npmjs.com/about-semantic-versioning); the `latest` tag is
the current stable version and `beta` may contain pre-released features.

### npm

```bash
npm install vviinn-widgets
```

```javascript
import { defineCustomElements } from "vviinn-widgets/dist/loader";

defineCustomElements();
```

Angular needs `CUSTOM_ELEMENTS_SCHEMA`, and Vue needs the `isCustomElement` compiler option;
both are covered in the [installation guide](https://docs.vviinn.com/widgets/getting-started/installation/).

## Usage

Render a search button — it brings the search modal with it:

```html
<vviinn-vps-button token="YOUR_TOKEN"></vviinn-vps-button>
```

or recommendations for a given product:

```html
<vviinn-vpr-widget token="YOUR_TOKEN" product-id="YOUR_PRODUCT_ID"></vviinn-vpr-widget>
```

Components can also be created through the DOM API, in which case props are set as
properties rather than attributes:

```javascript
const widget = document.createElement("vviinn-vpr-widget");
widget.token = "YOUR_TOKEN";
widget.productId = "YOUR_PRODUCT_ID";

document.body.append(widget);
```

## Public components

The components below are the supported public API — the ones you place in your own markup.

| Component | Purpose |
| --- | --- |
| `vviinn-vps-widget` | Visual Product Search — modal image search |
| `vviinn-vps-button` | Trigger button for the search widget |
| `vviinn-vpr-widget` | Visual Product Recommendations for a product |
| `vviinn-vpr-button` | Trigger button for the recommendations widget |
| `vviinn-shop-the-look` | Interactive image hotspots with recommendations |
| `vviinn-text-search` | Text search input; `mode="extended"` adds image upload |
| `vviinn-suggestions` | AI suggestions for the current query |
| `vviinn-results` | Product result grid |
| `vviinn-product-card` | Single product tile |
| `vviinn-filters` | Filter row |
| `vviinn-extended-filters` | Filter modal |
| `vviinn-selected-filters` | Active filter chips |
| `vviinn-cropper` | Image cropping interface |

Other components registered in the bundle are internal building blocks used by the widgets —
for example modals, sliders, skeletons and the camera — and may change in any release without
notice.

## Ways to integrate

- **Widget** — `vviinn-vps-button` opens `vviinn-vps-widget`, which brings the whole search
  experience (results, filters, suggestions) with it. This is the fastest integration.
- **Standalone components** — compose `vviinn-text-search`, `vviinn-suggestions`,
  `vviinn-results`, `vviinn-filters` and the rest yourself and wire them together through
  their events. This gives you full control over layout, at the cost of doing the wiring the
  widget would otherwise do for you. Every component in the table above works in this shape.

## Documentation

- **Widget documentation:** https://docs.vviinn.com/widgets/ — integration guides, events
  and customization for every widget.
- **Live playground:** https://widgets.vviinn.com — try the widgets with their props, CSS
  variables, CSS parts and slots, and read the widget changelog.
- **API documentation:** https://docs.vviinn.com/api/
- **Release notes:** [CHANGELOG.md](https://github.com/vviinn/widgets/blob/develop/CHANGELOG.md)

## Contributing

Bug reports, feature requests and pull requests are all welcome — start by
[opening an issue](https://github.com/vviinn/widgets/issues). See
[CONTRIBUTING.md](CONTRIBUTING.md) for the development setup and what we look for in a pull
request.

## Security

Please do not report security issues in public issues. See [SECURITY.md](SECURITY.md).

## Support

For questions about your account, product feed or integration, contact
[support@vviinn.com](mailto:support@vviinn.com).

## License

[Apache License 2.0](LICENSE)

## Name and logo

The license covers the software. It does not grant any right to use the "vviinn" name or
the vviinn logo.

You may state that your project uses these widgets. You may not use the name or the logo as
the name of your own project, as its logo, or in any way that suggests your project is
published or endorsed by us. A fork has to carry a different name.
