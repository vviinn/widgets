export const gridDecorator = (story: () => any) => `
<style>
  @media (min-width: 836px) {
    #root-inner {
      padding: 0 10%;
    }
  }

  @media (max-width: 860px) {
    vviinn-product-card::part(title),
    vviinn-product-card::part(brand),
    vviinn-product-card::part(type),
    vviinn-product-card::part(price-container) {
      font-size: 14px;
    }
  }
</style>
${story()}
`;

export const continuityDecorator = (story: () => any) => `
<style>
  @media (min-width: 836px) {
    #root-inner {
      padding-left: 10%;
    }
  }
</style>
${story()}
`;
