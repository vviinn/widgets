export const productDecorator = (story) => `
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

</style>
<div class="product-wrapper">
  ${story()}
</div>
`;
