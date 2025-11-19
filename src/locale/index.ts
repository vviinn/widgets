export * from "./resources";
export * from "./types";

import i18next from "i18next";
import { resources } from "./resources";
import { globalState } from "../store/store";

/**
 * Initialize or update i18next with the target locale.
 * Handles both initial setup and language changes.
 * Falls back to globalState.locale if no locale provided.
 */
export const initializeLocale = async (locale?: string): Promise<void> => {
  const targetLocale = locale ?? globalState.locale;

  if (i18next.isInitialized) {
    await i18next.changeLanguage(targetLocale);
  } else {
    await i18next.init({
      lng: targetLocale,
      fallbackLng: "en",
      resources,
    });
  }
};
