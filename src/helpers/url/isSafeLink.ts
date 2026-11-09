const SCRIPT_PROTOCOLS = new Set(["javascript:", "data:", "vbscript:"]);

/** Whether a link from the API may go into `href` or navigation: anything but a script-capable scheme. */
export const isSafeLink = (url: string | null | undefined): url is string => {
  if (!url) return false;
  try {
    return !SCRIPT_PROTOCOLS.has(new URL(url, document.baseURI).protocol);
  } catch {
    return false;
  }
};
