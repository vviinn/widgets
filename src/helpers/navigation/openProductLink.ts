export const openProductLink = (
  deeplink: string,
  event: MouseEvent,
  productDetailsRedirect: boolean = true,
  productDetailsNewTab: boolean = false,
): void => {
  if (!productDetailsRedirect) return;

  const shouldOpenInNewTab =
    productDetailsNewTab || event.ctrlKey || event.metaKey;

  if (shouldOpenInNewTab) {
    window.open(deeplink, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = deeplink;
  }
};
