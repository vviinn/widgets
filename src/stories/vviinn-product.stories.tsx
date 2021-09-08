export default {
  title: "Components/Product",
  component: "vviinn-product-card",
};

const Template = ({
  productTitle,
  brand,
  productType,
  price,
  image
}) =>
  `<vviinn-product-card
     product-title="${productTitle}"
     brand="${brand}"
     product-type="${productType}"
     price="${price}"
     image="${image}"
   ></vviinn-product-card>`;

export const Default = Template.bind({});
Default.args = {
  productTitle: "1968 Fender Precision Bass Vintage Electric Bass Guitar Sunburst 100% Original Case",
  productType: "Bass guitar",
  brand: "Fender",
  price: 624244,
  image: "https://images.reverb.com/image/upload/s--pj8uk5Tr--/t_card-square/v1627963897/tcm9cwywsxfzrsnip3tm.jpg"
};
