import { p as promiseResolve, b as bootstrapLazy } from './index-d92b0799.js';
import { g as globalScripts } from './app-globals-ceab92a8.js';

/*
 Stencil Client Patch Browser v2.9.0 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy([["cropper-handler",[[1,"cropper-handler",{"handler":[16],"disabled":[4]}]]],["vviinn-carousel_3",[[1,"vviinn-vpr-widget",{"blockTitle":[1,"block-title"],"columns":[2],"imageRatio":[2,"image-ratio"],"imageWidth":[2,"image-width"],"productId":[1,"product-id"],"token":[1],"currencySign":[1,"currency-sign"],"pricePrefix":[1,"price-prefix"],"mode":[1],"campaignType":[1,"campaign-type"],"locale":[1],"apiPath":[1,"api-path"],"showScroll":[4,"show-scroll"],"recommendations":[32],"loaded":[32]}],[1,"vviinn-carousel",{"mode":[1],"imageWidth":[2,"image-width"],"showScroll":[4,"show-scroll"],"moveDirection":[32],"contentGroups":[32],"activeContentGroup":[32]}],[1,"vviinn-product-card",{"brand":[1],"currency":[1],"deeplink":[1],"image":[1],"imageRatio":[2,"image-ratio"],"imageWidth":[2,"image-width"],"locale":[1],"price":[2],"pricePrefix":[1,"price-prefix"],"productId":[1,"product-id"],"productTitle":[1,"product-title"],"productType":[1,"product-type"],"salePrice":[2,"sale-price"],"responsive":[4],"imageLoaded":[32]}]]],["vpr-slider",[[0,"vpr-slider",{"mode":[1],"imageRatio":[2,"image-ratio"],"imageWidth":[2,"image-width"],"productsInGrid":[2,"products-in-grid"],"wrappedItems":[32],"slidePosition":[32],"resetSliderPosition":[64],"loadProducts":[64]}]]],["vviinn-error",[[1,"vviinn-error"]]],["vviinn-preloader",[[1,"vviinn-preloader"]]],["highlight-box_22",[[1,"vviinn-image-view"],[0,"vviinn-onboarding"],[1,"vviinn-example-images",null,[[0,"exampleImageSelected","handleImageSelection"],[0,"exampleImageError","handleImageSelectionError"]]],[1,"vviinn-overlayed-modal",{"active":[4]}],[1,"vviinn-empty-results"],[1,"vviinn-image-selector"],[1,"vviinn-server-error"],[1,"vviinn-wrong-format"],[1,"search-filters",{"filter":[16],"selectedCategoryId":[32],"hideFilters":[32]}],[1,"vviinn-privacy-badge"],[1,"vviinn-teaser"],[1,"image-cropper",{"disabled":[4],"handleMove":[32]}],[1,"vviinn-example-image",{"src":[1],"width":[2],"height":[2],"selected":[32]}],[1,"highlight-box"],[1,"vviinn-detected-object",{"detectedObject":[16],"position":[32]}],[1,"vviinn-modal",{"active":[1540],"slider":[32]}],[1,"vviinn-onboarding-card-1"],[1,"vviinn-onboarding-card-2"],[1,"vviinn-onboarding-card-3"],[1,"vviinn-overlay"],[1,"vviinn-slide"],[1,"vviinn-slider",{"showBullets":[4,"show-bullets"],"position":[514],"showArrows":[4,"show-arrows"],"elementsCount":[32],"internalPosition":[32],"swipeStartPosition":[32]}]]],["vviinn-vps-widget",[[1,"vviinn-vps-widget",{"token":[1],"apiPath":[1,"api-path"],"active":[1028],"currencySign":[1,"currency-sign"],"locale":[1],"slidePosition":[32],"width":[32],"wrongImageFormat":[32]}]]],["vviinn-vps-button",[[1,"vviinn-vps-button",{"token":[1],"currencySign":[1,"currency-sign"],"locale":[1],"apiPath":[1,"api-path"],"pressed":[32]},[[0,"modalClosed","handleModalClosed"]]]]]], options);
});
