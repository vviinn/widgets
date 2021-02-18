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
  imageWidth,
  crossSellingCampaign,
  mobileColumns,
  tabletColumns,
  desktopColumns
}) => `
<style>
body {
  font-size: ${fontSize}px;  
  color: ${fontColor};
  line-height: ${lineHeight}px;
}

vi-vpr-view::part(product-title) {
  color: ${fontColor};
  font-weight: 500;
  white-space: nowrap;
  font-size: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
}

vi-vpr-view::part(product-type) {
  font-weight: 400;
  color: #19181e;
  font-size: 18px;
}

vi-vpr-view::part(price-regular),
vi-vpr-view::part(price-discount) {
  font-weight: 600;
  color: ${fontColor};
  font-size: inherit;
}

vi-vpr-view::part(price-discount) {
  grid-column: 2;
}

vi-vpr-view::part(price-outdated) {
  color: #b8b8ba;
  grid-column: 1;
  margin-top: 2px;
}

${ mobileColumns ? `
@media (max-width: 43em) {
  body::after {
    content: "mobile"
  }

  body {
    font-size: 10px;
    line-height: 10px;
  }

  vi-vpr-view::part(grid) {
    --columns: ${mobileColumns};
  }
}
` : ''}

${ tabletColumns ? `
@media (min-width: 43em) {
  body::after {
    content: "tablet"
  }

  body {
    font-size: 10px;
    line-height: 10px;
  }

  vi-vpr-view::part(grid) {
    --columns: ${tabletColumns};
  }
}
` : ''}

${ desktopColumns ? `
@media (min-width: 62em) {
  body::after {
    content: "desktop"
  }

  vi-vpr-view::part(grid) {
    --columns: ${desktopColumns};
  }
}
` : ''}

  </style>
  <vi-vpr-view token=${token}
            product-id=${productId}
            block-title=${blockTitle}
            slider-mode=${sliderMode}
            columns=${columns}
            currency-sign=${currencySign}
            image-width="${imageWidth}"
            campaign-type="${crossSellingCampaign ? "VSC" : "VPR"}">
  </vi-vpr-view>
`;

export const VI_VPR_View = MoptVprStory.bind({});

VI_VPR_View.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgyLCJqdGkiOiI4ZDU2ZWY4OC1lZWVlLTRiOWQtOTBkYi05OWM3NGNlOGY0ZDYiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.zMVTgD91RMHUYXXhORIZk5sI0R2Jz4Yryz_jlaoBSLo24evOQWslh2QDfJZGEH63gTCpGvnCuaEQP9iA9xnCTDhpcrViricwBngxt6Z9r2NfCpwC-XKBF_kJWhsSnixcJiuTXUpzTYvnLAQ37QfrElkEbG77J7EMgJsuYy4fqAQ",
  productId: "130351",
  blockTitle: "Recommendations",
  sliderMode: true,
  columns: 0,
  currencySign: "€",
  lineHeight: 20,
  fontSize: 20,
  imageWidth: 200,
  fontColor: "#19181e",
  crossSellingCampaign: false,
  mobileColumns: undefined,
  tabletColumns: undefined,
  desktopColumns: undefined
};

export default {
  title: "Web Component",
  component: MoptVprStory(VI_VPR_View),
  argTypes: {
    fontColor: { name: "Font color", control: "color" },
    mobileColumns: { name: "Slider columns on mobile", control: "number" },
    tabletColumns: { name: "Slider columns on tablet", control: "number" },
    desktopColumns: { name: "Slider columns on desktop", control: "number" },
    columns: { name: "Products in grid mode", control: "number" },
  },
  parameters: {
    actions: {
      handles: [
        "recommendationLoad",
        "recommendationView",
        "recommendationClick",
      ],
    },
  },
};
