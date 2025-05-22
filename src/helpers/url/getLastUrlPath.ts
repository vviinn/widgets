export function getLastUrlPath(url?: string): string {
  if (!url) return "";
  if (!url.includes("://")) return url;
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    return segments.length ? `/${segments.pop()}` : url;
  } catch {
    return url;
  }
}
