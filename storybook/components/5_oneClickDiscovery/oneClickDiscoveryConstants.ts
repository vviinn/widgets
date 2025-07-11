import { codeWithExtraProps } from "../../helpers/codeWithExtraProps";

const resultsCode = `<vviinn-results 
    token="TOKEN" 
    image-resolution-width="500" 
    locale="en-US" 
    results-count="6"
    text-search-query="EXAMPLE_QUERY"
    product-details-new-tab="true"
></vviinn-results>`;

const vprButtonCode = `<vviinn-vpr-button 
                token="TOKEN" 
                product-id="PRODUCT_ID" 
                block-title=""
                locale="en-US"
                product-details-new-tab="true"
            ></vviinn-vpr-button> `;

const productCardCode = (cardProps: string) => `    <div class="product">
        <a class="product__image" href="#"></a>
        <div class="product__name">
            <a href="#">Product Name</a>
        </div>
        <div class="product__price">
            $10.00 
            ${codeWithExtraProps(vprButtonCode, cardProps)}
        </div>
    </div>`;

export const oneClickDiscoveryConstants = {
  modal: {
    groupId: "modalDiscovery",
    header: "One-click Discovery Modal",
    code: codeWithExtraProps(
      resultsCode,
      '    one-click-discovery-mode="modal"',
    ),
  },
  appendGrid: {
    groupId: "appendGridDiscovery",
    header: "One-click Discovery Appended Grid",
    code: codeWithExtraProps(
      resultsCode,
      '    one-click-discovery-mode="append-grid"',
    ),
  },
  appendSlider: {
    groupId: "appendSliderDiscovery",
    header: "One-click Discovery Appended Slider",
    code: codeWithExtraProps(
      resultsCode,
      '    one-click-discovery-mode="append-slider"',
    ),
  },
  standalone: {
    groupId: "standaloneDiscovery",
    header: "One-click Discovery Itself",
    code: `<div class="collection">
${productCardCode('                mode="continuity"')}
${productCardCode('                mode="grid"')}
${productCardCode('                mode="set"')}
</div>`,
  },
};
