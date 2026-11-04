// Top-level embeddable widgets only — the internal children they render inherit
// these values from their parent.
const TOKEN_WIDGETS = [
  "vviinn-cropper",
  "vviinn-results",
  "vviinn-shop-the-look",
  "vviinn-suggestions",
  "vviinn-text-search",
  "vviinn-vpr-button",
  "vviinn-vpr-widget",
  "vviinn-vps-button",
  "vviinn-vps-widget",
];

const PRODUCT_ID_WIDGETS = ["vviinn-vpr-button", "vviinn-vpr-widget"];

const devConfig = window.VVIINN_DEV ?? {};

if (!devConfig.token || !devConfig.productId) {
  console.warn(
    "Dev config incomplete — copy dev/dev-config.example.js to dev/dev-config.js and fill in the values.",
  );
}

const inject = (tags, attribute, value) => {
  if (!value) return;

  // Markup wins: hardcoding another tenant's value in index.html is how you test one.
  document.querySelectorAll(tags.join(",")).forEach((element) => {
    if (!element.hasAttribute(attribute))
      element.setAttribute(attribute, value);
  });
};

inject(TOKEN_WIDGETS, "token", devConfig.token);
inject(TOKEN_WIDGETS, "api-path", devConfig.apiPath);
inject(PRODUCT_ID_WIDGETS, "product-id", devConfig.productId);
