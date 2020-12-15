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
            image-width="${imageWidth}"
            campaign-type="${crossSellingCampaign ? "VSC" : "VPR"}">
  </vi-vpr-view>
`;

export const VI_VPR_View = MoptVprStory.bind({});

VI_VPR_View.args = {
  token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjE0LCJqdGkiOiI3YzY3ZDY1Yy1iMzE2LTQzMDMtYjU3My0xZmIyYmI2MGQ4NTciLCJzY29wZXMiOlsidnByIiwidnBzIiwidmNzIl19.k11FFSpXiTTPatpWVoVD_ZzQbtlgepyzIL0MnhGeTU8ABEAkHEtuPyXTOdzQN0VHhJXjcXT7tA71G0PIR6RlybXWTKPeMUAzSjV5oZUD41k0y8dMvCd_t4O0CCVpigE81ZD01-NDR_AGVdQFnEQrXXv0_MhgtXe36Cuyoi_bvbQ",
  productId: "0007590659994c213d2f14694624ea4a",
  blockTitle: "Recommendations",
  sliderMode: true,
  columns: 0,
  currencySign: "€",
  lineHeight: 20,
  fontSize: 20,
  imageWidth: 200,
  fontColor: "#19181e",
  crossSellingCampaign: false,
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
