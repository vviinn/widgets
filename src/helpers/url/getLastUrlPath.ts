export function getLastUrlPath(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url, "http://dummy");
    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments.length ? `/${segments.pop()}` : url;
  } catch {
    return url;
  }
}
