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

  </style>
  <vi-vpr-view token=${token}
            product-id=${productId}
            block-title=${blockTitle}
            slider-mode=${sliderMode}
            columns=${columns}
            currency-sign=${currencySign}
            image-width="${imageWidth}">
  </vi-vpr-view>
`;

export const VI_VPR_View = MoptVprStory.bind({});

VI_VPR_View.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgyLCJqdGkiOiI4ZDU2ZWY4OC1lZWVlLTRiOWQtOTBkYi05OWM3NGNlOGY0ZDYiLCJzY29wZXMiOlsidnByIiwidnBzIl19.b8KzSNCbM_V385cq7nC21-CBevVJ-YdnTadCuMmnrjIBubd8sSaeeihjkaY7m-Uw5eHdDuZNbKHpZ6bb5SWE5_4iB25aTC6Epx6mjhPM03mhvOwtLT22gkvDSaejpdHnkB5yMXSIgO2SyYSeaMqSNaUEabBVbLT2SfqmieJXiAI",
  productId: "875869",
  blockTitle: "Recommendations",
  sliderMode: true,
  columns: 0,
  currencySign: "€",
  lineHeight: 20,
  fontSize: 20,
  imageWidth: 200,
  fontColor: "#19181e",
};

export default {
  title: "Web Component",
  component: MoptVprStory(VI_VPR_View),
  argTypes: {
    fontColor: { control: "color" },
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
