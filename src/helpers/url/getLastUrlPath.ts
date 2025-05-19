export const getLastUrlPath = (url?: string) => {
  if (!url) return "";
  try {
    const u = new URL(url, "http://dummy");
    return u.pathname.split("/").filter(Boolean).pop()
      ? "/" + u.pathname.split("/").filter(Boolean).pop()
      : u.pathname;
  } catch {
    const parts = url.split("/").filter(Boolean);
    return parts.length ? "/" + parts.pop() : url;
  }
};
