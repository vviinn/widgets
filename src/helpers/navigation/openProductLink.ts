import { navigateTo } from "./navigateTo";

export const openProductLink = (
  deeplink: string,
  event: MouseEvent,
  productDetailsRedirect: boolean = true,
  productDetailsNewTab: boolean = false,
): void => {
  if (!productDetailsRedirect) return;

  navigateTo(deeplink, productDetailsNewTab || event.ctrlKey || event.metaKey);
};
