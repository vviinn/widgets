import { isSafeLink } from "../url/isSafeLink";

/** Navigates to a URL from the API or a prop; a link `isSafeLink` rejects goes nowhere. */
export const navigateTo = (url: string, newTab: boolean = false): void => {
  if (!isSafeLink(url)) return;

  if (newTab) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = url;
  }
};
