export const ResultsTemplate = (args) => {
  const {
    token,
    apiPath,
    searchId,
    imageResolutionWidth,
    currencySign,
    locale,
    productDetailsRedirect,
    productDetailsNewTab,
    showInWidget,
    uiSessionId,
    resultsCount,
    filterColumn,
    filterValue,
    textSearchQuery,
    addToBasketShow,
  } = args;

  const filterAttributes =
    filterColumn && filterValue
      ? `filter-column="${filterColumn}" filter-value="${filterValue}"`
      : "";

  const searchQueryAttribute = textSearchQuery
    ? `text-search-query="${textSearchQuery}"`
    : "";

  return `
  <div class="search-page-wrapper">
  <div class="search-page-wrapper-filters">
    <vviinn-extended-filters locale="${args.locale}" mode="preview"></vviinn-extended-filters>
  </div>
  <div class="search-page-wrapper-result">
    <div class="search-page-wrapper-result-filters">
      <vviinn-extended-filters locale="${args.locale}"></vviinn-extended-filters>
      <vviinn-selected-filters></vviinn-selected-filters>
    </div>

    <vviinn-results
    token="${token}"
    api-path="${apiPath}"
    search-id="${searchId}"
    image-resolution-width="${imageResolutionWidth}"
    currency-sign="${currencySign}"
    locale="${locale}"
    product-details-redirect="${productDetailsRedirect}"
    product-details-new-tab="${productDetailsNewTab}"
    show-in-widget="${showInWidget}"
    ${searchQueryAttribute}
    ${filterAttributes}
    ui-session-id="${uiSessionId}"
    results-count="${resultsCount}"
    add-to-basket-show="${addToBasketShow}"
  ></vviinn-results>
  </div>
</div>`;
};
