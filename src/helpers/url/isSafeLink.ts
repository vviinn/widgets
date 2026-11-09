const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:"]);

/** Whether a link from the API may go into `href` or navigation: an http(s) URL or a relative path. */
export const isSafeLink = (url: string | null | undefined): url is string => {
  if (!url) return false;
  try {
    return SAFE_LINK_PROTOCOLS.has(new URL(url, document.baseURI).protocol);
  } catch {
    return false;
  }
};
