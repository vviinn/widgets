export type ResultsPageParamNames = {
  query: string;
  searchId: string;
};

export const DEFAULT_RESULTS_PAGE_PARAM_NAMES: ResultsPageParamNames = {
  query: "query",
  searchId: "searchId",
};

export const parseResultsPageParamNames = (
  raw?: string,
): ResultsPageParamNames => {
  const result = { ...DEFAULT_RESULTS_PAGE_PARAM_NAMES };
  if (!raw) return result;
  const params = new URLSearchParams(raw);
  const query = params.get("query");
  const searchId = params.get("searchId");
  if (query) result.query = query;
  if (searchId) result.searchId = searchId;
  return result;
};

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
  queryParamName: string = DEFAULT_RESULTS_PAGE_PARAM_NAMES.query,
): string => {
  const url = resolveResultsPageUrl(resultsPageUrl);
  url.searchParams.set(queryParamName, query);
  return url.toString();
};

export const buildImageSearchRedirectUrl = (
  resultsPageUrl: string,
  searchId: string,
  searchIdParamName: string = DEFAULT_RESULTS_PAGE_PARAM_NAMES.searchId,
): string => {
  const url = resolveResultsPageUrl(resultsPageUrl);
  url.searchParams.set(searchIdParamName, searchId);
  return url.toString();
};

export const parseResultsPageParams = (
  search: string = window.location.search,
  paramNames: ResultsPageParamNames = DEFAULT_RESULTS_PAGE_PARAM_NAMES,
): { query?: string; searchId?: string } => {
  const params = new URLSearchParams(search);
  const query = params.get(paramNames.query);
  const searchId = params.get(paramNames.searchId);
  return {
    ...(query && { query }),
    ...(searchId && { searchId }),
  };
};
