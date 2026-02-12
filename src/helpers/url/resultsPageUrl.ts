export const resolveResultsPageUrl = (resultsPageUrl: string): URL =>
  new URL(resultsPageUrl, window.location.origin);

const normalizePathname = (pathname: string): string =>
  pathname.replace(/\/+$/, "") || "/";

export const isOnResultsPage = (resultsPageUrl: string): boolean =>
  normalizePathname(window.location.pathname) ===
  normalizePathname(resolveResultsPageUrl(resultsPageUrl).pathname);

export const buildTextSearchRedirectUrl = (
  resultsPageUrl: string,
  query: string,
): string => {
  const url = resolveResultsPageUrl(resultsPageUrl);
  url.searchParams.set("query", query);
  return url.toString();
};

export const buildImageSearchRedirectUrl = (
  resultsPageUrl: string,
  searchId: string,
): string => {
  const url = resolveResultsPageUrl(resultsPageUrl);
  url.searchParams.set("searchId", searchId);
  return url.toString();
};
