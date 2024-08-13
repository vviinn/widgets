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
  } = args;

  const filterAttributes =
    filterColumn && filterValue
      ? `filter-column="${filterColumn}" filter-value="${filterValue}"`
      : "";

  const searchQueryAttribute = textSearchQuery
    ? `text-search-query="${textSearchQuery}"`
    : "";

  return `<vviinn-results
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
  ></vviinn-results>`;
};
