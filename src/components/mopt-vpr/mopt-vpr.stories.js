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

  mopt-vpr::part(product) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(6, max-content);
    line-height: ${lineHeight}px;
  }

  mopt-vpr::part(product-image-link) {
    grid-column: 1/-1;
    grid-row: 1/2;
  }

  mopt-vpr::part(product-title) {
    color: inherit;
    grid-column: 1/-1;
    grid-row: 2/3;
    text-decoration: none;
    font-weight: bold;
  }

  mopt-vpr::part(brand) {
    grid-column: 1/-1;
    grid-row: 3/4;
  }

  mopt-vpr::part(product-type) {
    grid-column: 1/-1;
    grid-row: 4/5;
  }

  mopt-vpr::part(price-outdated) {
    grid-column: 1;
    justify-self: end;
  }

  mopt-vpr::part(price-discount) {
    grid-column: 2;
    justify-self: start;
    font-weight: bold;
    color: ${salePriceColor};
  }

  mopt-vpr::part(price-regular) {
    grid-column: 1/-1;
    justify-self: center;
  }

  </style>
  <mopt-vpr token=${token}
            product-id=${productId}
            block-title=${blockTitle}
            slider-mode=${sliderMode}
            columns=${columns}
            currency-sign=${currencySign}
            image-width="200">
  </mopt-vpr>
`;

export const MoptVpr = MoptVprStory.bind({});

MoptVpr.args = {
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjQyLCJqdGkiOiIyMjU4MTNjYy1lOTM1LTRkNGQtYjZjNy1jYzZkMTZlN2QwMGQiLCJzY29wZXMiOlsidnByIiwidnBzIl19.RaCZ2RDLlIEZLPMS2GxIMV2D5Dx-j_KyLmeG20kAjdFsFq-4FDNYnv7Mr21c-tmZ_qBNGgD8a_S1n_UHbCCUA-OKHmeslflZw4J3oKzgXWB7O2Gv4K9RzgyyBX909AVcwWTyYiMW_et8E_jHvODGeN9nn3idQsSg16giqxNx1Ac',
  productId: '80928998',
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
  component: MoptVprStory({}),
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
