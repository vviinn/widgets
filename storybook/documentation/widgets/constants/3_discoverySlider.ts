import { codeWithExtraProps } from "../../../helpers/codeWithExtraProps";

const sliderCode = `<vviinn-vpr-widget
    token="TOKEN"
    product-id="PRODUCT_ID"
    block-title=""
    locale="en-US"
    product-details-new-tab="true"
></vviinn-vpr-widget>`;
export const discoverySliderExamples = {
  grid: {
    groupId: "sliderGrid",
    header: "Discovery Slider Grid",
    code: codeWithExtraProps(sliderCode, '    mode="grid"'),
    descriptionText: "",
  },
  fluid: {
    groupId: "sliderFluid",
    header: "Discovery Slider Fluid",
    code: sliderCode,
    descriptionText: "",
  },
};
