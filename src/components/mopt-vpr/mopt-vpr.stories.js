const MoptVprStory = ({
  token,
  productId,
  blockTitle,
  sliderMode,
  columns,
  currencySign
}) => `
  <mopt-vpr token=${token}
            product-id=${productId}
            block-title=${blockTitle}
            slider-mode=${sliderMode}
            columns=${columns}
            currency-sign=${currencySign}>
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
};

export default {
  title: 'Web Component component',
  component: MoptVprStory({}),
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
