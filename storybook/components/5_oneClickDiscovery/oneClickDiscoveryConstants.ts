import { codeWithExtraProps } from "../../helpers/codeWithExtraProps";

const resultsCode = `<vviinn-results 
    token="TOKEN" 
    image-resolution-width="500" 
    locale="en-US" 
    results-count="6"
    text-search-query="EXAMPLE_QUERY"
    product-details-new-tab="true"
></vviinn-results>`;

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
    <div class="product">
        <a class="product__image" href="#"></a>
        <div class="product__name">
            <a href="#">Product Name</a>
        </div>
        <div class="product__price">
            $10.00 
            <vviinn-vpr-button 
                token="TOKEN" 
                product-id="PRODUCT_ID" 
                mode="continuity" 
                block-title=""
                locale="en-US"
                product-details-new-tab="true"
            ></vviinn-vpr-button> 
        </div>
    </div>
    <div class="product">
        <a class="product__image" href="#"></a>
        <div class="product__name">
            <a href="#">Product Name</a>
        </div>
        <div class="product__price">
            $10.00  
            <vviinn-vpr-button 
                token="TOKEN" 
                product-id="PRODUCT_ID" 
                mode="grid" 
                block-title=""
                locale="en-US"
                product-details-new-tab="true"
            ></vviinn-vpr-button> 
        </div>
    </div>
    <div class="product">
        <a class="product__image" href="#"></a>
        <div class="product__name">
            <a href="#">Product Name</a>
        </div>
        <div class="product__price">
            $10.00  
            <vviinn-vpr-button 
                token="TOKEN" 
                product-id="PRODUCT_ID" 
                mode="set" 
                block-title=""
                locale="en-US"
                product-details-new-tab="true"
            ></vviinn-vpr-button> 
        </div>
    </div>
</div>`,
  },
};

//  camera: {
//     groupId: "cameraModal",
//     header: "",
//     code: ``,
//     descriptionText: "",
//   },
