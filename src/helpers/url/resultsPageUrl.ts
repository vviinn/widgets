export const resolveResultsPageUrl = (resultsPageUrl: string): URL =>
  new URL(resultsPageUrl, window.location.origin);

const normalizePathname = (pathname: string): string =>
  pathname.replace(/\/+$/, "") || "/";

export const isOnResultsPage = (resultsPageUrl: string): boolean =>
  normalizePathname(window.location.pathname) ===
  normalizePathname(resolveResultsPageUrl(resultsPageUrl).pathname);

export const buildResultsPageRedirectUrl = (
  resultsPageUrl: string,
  query: string,
): string => {
  const url = resolveResultsPageUrl(resultsPageUrl);
  url.searchParams.set("q", query);
  return url.toString();
};
