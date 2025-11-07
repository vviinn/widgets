export const vviinnResultsCode = (resultsCount?: number) => `<vviinn-results 
    token="TOKEN" 
    image-resolution-width="500" 
    locale="en-US" 
    results-count="${resultsCount ?? 9}"
    text-search-query="EXAMPLE_QUERY"
    product-details-new-tab="true"
></vviinn-results>`;
