export const encodeToBase64UTF8 = (str: string) => {
  const encoder = new TextEncoder();
  const utf8Array = encoder.encode(str);
  return btoa(String.fromCharCode.apply(null, utf8Array));
};
