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

vviinn-product-card::part(custom-label-content) {
  display: block;
}

</style>
<div class="product-wrapper">
  ${story()}
</div>
`;
