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
    const newTab = window.open();
    if (newTab) {
      newTab.location.href = deeplink;
    } else {
      window.location.href = deeplink;
    }
  } else {
    window.location.href = deeplink;
  }
};
