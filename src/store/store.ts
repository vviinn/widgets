import { WidgetEvent } from "vviinn-tracking-client-ts";
import { ProductEvent, ResultEvent } from "../recommendation/events";
import { createTrackingApi } from "../openApi";
import { Locale } from "../locale";
import { isTrackingEnabled, disableTracking } from "./tracking";

type DefaultConfig = {
  locale: Locale;
  currencySign: string;
  apiPath: string;
};

export const defaultConfig: DefaultConfig = {
  locale: "de-DE",
  currencySign: "€",
  apiPath: "https://api.vviinn.com",
};

export const trackEvent = async (
  event: WidgetEvent | ProductEvent | ResultEvent,
  token: string,
  apiPath: string = defaultConfig.apiPath,
): Promise<void> => {
  if (!isTrackingEnabled() || !event || !token) return;

  try {
    const trackingApi = createTrackingApi(apiPath, token);
    const result = await trackingApi.trackEvent(event);
    if (result.status === "rejected") {
      disableTracking();
    }
  } catch (error) {
    console.error("Tracking event error:", error);
  }
};
