const ProductPageStory = ({
}) => `
  <style>
.product {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 2rem;
  justify-content: center;
}

.product_image img {
  width: 500px;
  height: 500px;
  object-position: center;
  object-fit: contain;
}

.product_data {
  display: flex;
  flex-direction: column;
}

.product_title {
  color: #19181e;
  font-size: 30px;
  font-weight: 500;
}

.product_type {
  font-size: 20px;
  color: #19181e;
  font-weight: 400;
  margin: 0 0 34px;
}

.product_price {
  font-size: 25px;
  color: #000;
  font-weight: 500;
  margin-bottom: 15rem;
}

button {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  padding: 0 2rem;
  text-align: center;
  text-transform: uppercase;
  font-weight: 500;
  border: 0;
  font-family: 'Darker Grotesque', sans-serif;
}

.buy {
  background: #b8b8ba;
  color: white;
  margin-bottom: 1rem;
}

.buy_icon {
  background-repeat: no-repeat;
  background-image: url(https://www.lodenfrey.com/out/LF/img/sprites/svgsprite.svg);
  display: block;
  width: 31px;
  height: 32px;
  background-position: -886px -201px;
  background-size: 1032px 418px;
  display: inline-block;
  position: relative;
  top: 8px;
  margin-right: 22px;
}

  </style>
  <div class="product">
    <div class="product_image">
      <img alt="product image" src="https://www.lodenfrey.com/out/pictures/generated/product/1/944_1180_75/00712603-004_1.jpg">
    </div>
    <div class="product_data">
      <div class="product_title">Santoni</div>
      <div class="product_type">Chelsea Boots</div>
      <div class="product_price">749,00 €</div>
      <button class="buy">
        <div class="buy_icon"></div>
        <span>In den Warenkorb</span>
      </button>
    </div>
  </div>
`;

export const ProductView = ProductPageStory.bind({});

export default {
  title: 'Demo page',
  component: ProductPageStory({})
};
