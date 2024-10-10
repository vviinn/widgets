export const gridDecorator = (story) => `
<style>
  @media (min-width: 836px) {
    #root-inner {
      padding: 0 10%;
    }
  }

  @media (max-width: 860px) {
    vviinn-product-card::part(title),
    vviinn-product-card::part(brand),
    vviinn-product-card::part(price-outdated),
    vviinn-product-card::part(price-regular),
    vviinn-product-card::part(price-sale),
    vviinn-product-card::part(energy-label) {
      font-size: 14px;
    }
  }
</style>
${story()}
`;

export const continuityDecorator = (story) => `
<style>
  @media (min-width: 836px) {
    #root-inner {
      padding-left: 10%;
    }
  }
</style>
${story()}
`;
