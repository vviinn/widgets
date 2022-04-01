export const productDecorator = (story: () => any) => `
<style>
html, body, #root, #root-inner {
  width: 100%;
  height: 100%;
}

#root-inner {
  display: grid;
  align-items: center;
  justify-items: center;
}

.product-wrapper {
  width: 240px;
}

vviinn-product-card {
  align-items: start;
}

vviinn-product-card::part(image) {
  border: 1px solid #DDDDDD;
}

vviinn-product-card::part(brand) {
  display: flex;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}

vviinn-product-card::part(brand),
vviinn-product-card::part(title) {
  text-align: left;
}

vviinn-product-card::part(title) {
  order: 2;
  max-width: unset;
}

vviinn-product-card::part(price-container) {
  order: 3;
}

</style>
<div class="product-wrapper">
  ${story()}
</div>
`;
