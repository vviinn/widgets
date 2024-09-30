export const productDecorator = (story, { args }) => `
<style>
html, body, #root, #root-inner {
  width: 100%;
  height: 100%;
}

.product-wrapper {
  width: 240px;
}

vviinn-product-card {
  --product-card-content-align: ${args.productCardContentAlign};
  --product-card-text-align: ${args.productCardTextAlign};
  --product-card-image-border: ${args.productCardImageBorder};
  --product-card-image-bg-color: ${args.productCardImageBgColor};
}

vviinn-product-card::part(price-label) {
  display: flex;
}

</style>
<div class="product-wrapper">
  ${story()}
</div>
`;
