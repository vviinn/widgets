export * from "./resources";
export * from "./types";

import i18next from "i18next";
import { resources } from "./resources";

/**
 * Initialize or update i18next with the target locale.
 * Handles both initial setup and language changes.
 */
export const initializeLocale = async (locale: string): Promise<void> => {
  if (i18next.isInitialized) {
    await i18next.changeLanguage(locale);
  } else {
    await i18next.init({
      lng: locale,
      fallbackLng: "en",
      resources,
    });
  }
};
