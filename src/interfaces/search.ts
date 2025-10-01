type s = import("./generated").components["schemas"];

// Visual Search
export type VisualSearchRequest = s["visual-search-request"];
export type VisualSearchResponse = s["visual-search-response"];

// Text Search
export type TextSearchRequest = s["text-search-request"];
export type TextSearchResponse = s["text-search-response"];

// Product Listing
export type ProductListingPageRequest = s["product-listing-page-request"];
export type ProductListingPageResponse = s["product-listing-page-response"];

// Search Utilities
export type SearchIdResponse = s["ion-visual-product-search"];
export type Rectangle = s["rectangle"];
