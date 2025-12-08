export const productDecorator = (story, { args }) => `
<style>
html, body, #root, #root-inner {
  width: 100%;
  height: 100%;
}

.product-wrapper {
  width: 300px;
  max-width: 100%;
}

vviinn-product-card {
  --product-card-content-align: ${args.productCardContentAlign};
  --product-card-text-align: ${args.productCardTextAlign};
  --product-card-image-border: ${args.productCardImageBorder};
  --product-card-image-bg-color: ${args.productCardImageBgColor};
  --product-card-image-aspect-ratio: ${args.productCardImageAspectRatio};
}

vviinn-product-card::part(custom-label-0), vviinn-product-card::part(custom-label-1), vviinn-product-card::part(custom-label-2), vviinn-product-card::part(custom-label-3), vviinn-product-card::part(custom-label-4) {
  display: block;
}

</style>
<div class="product-wrapper">
  ${story()}
</div>
`;
