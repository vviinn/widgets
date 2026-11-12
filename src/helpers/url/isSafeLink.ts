const LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/** Whether a link from the API may go into `href` or navigation: a web, mail or phone link, absolute or relative. */
export const isSafeLink = (url: string | null | undefined): url is string => {
  if (!url) return false;
  try {
    return LINK_PROTOCOLS.has(new URL(url, document.baseURI).protocol);
  } catch {
    return false;
  }
};
