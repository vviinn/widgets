const MoptVprStory = ({
  token,
  productId,
  blockTitle,
  sliderMode,
  columns,
  currencySign,
  lineHeight,
  fontSize,
  fontColor,
  salePriceColor
}) => `
  <style>
  body {
    font-size: ${fontSize}px;  
    color: ${fontColor}
  }

  vi-vpr-view::part(product) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, max-content);
    line-height: ${lineHeight}px;
  }

  vi-vpr-view::part(product-image-link) {
    grid-column: 1/-1;
    grid-row: 1/2;
  }

  vi-vpr-view::part(product-title) {
    color: inherit;
    grid-column: 1/-1;
    grid-row: 2/3;
    text-decoration: none;
    font-weight: bold;
  }

  vi-vpr-view::part(brand) {
    grid-column: 1/-1;
    grid-row: 3/4;
  }

  vi-vpr-view::part(product-type) {
    grid-column: 1/-1;
    grid-row: 4/5;
  }

  vi-vpr-view::part(price-outdated) {
    grid-column: 1;
    justify-self: end;
  }

  vi-vpr-view::part(price-discount) {
    grid-column: 2;
    justify-self: start;
    font-weight: bold;
    color: ${salePriceColor};
  }

  vi-vpr-view::part(price-regular) {
    grid-column: 1/-1;
    justify-self: center;
  }

  </style>
  <vi-vpr-view token=${token}
            product-id=${productId}
            block-title=${blockTitle}
            slider-mode=${sliderMode}
            columns=${columns}
            currency-sign=${currencySign}
            image-width="200">
  </vi-vpr-view>
`;

export const VI_Vpr_View = MoptVprStory.bind({});

VI_Vpr_View.args = {
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjY2LCJqdGkiOiIxYjEzMjFlZC02OTNjLTQwODQtOWZiYi1lY2YzNGU5NDM3NWUiLCJzY29wZXMiOlsidnByIiwidnBzIl19.D-NPLWN54WbEqvtwjiF45KhvGW0crChajIm-MnvxNXG4eArbb2xO7dOBykcgEHO8cj7erqXm6mdTwrOHljV-dL9QOXerdhMPGfqr1naZp4UEX125hSqPq2qYJVx0q4DfY_GrfkhSkS0KhlDJVWLOGiI6V0plfc4qSuVY_I8YdXo',
  productId: '100580000053410',
  blockTitle: 'Recommendations',
  sliderMode: true,
  columns: 4,
  currencySign: '€',
  lineHeight: 16,
  fontSize: 14,
  fontColor: '#7474741',
  salePriceColor: '#F64E4E'
};

export default {
  title: 'Web Component',
  component: MoptVprStory(VI_Vpr_View),
  argTypes: {
    fontColor: { control: 'color' },
    salePriceColor: { control: 'color' },
  },
  parameters: {
    actions: {
      handles: [
        'recommendationLoad',
        'recommendationView',
        'recommendationClick',
      ]
    },
  }
};
