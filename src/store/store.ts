import { createStore } from "@stencil/store";
import { WidgetEvent } from "vviinn-tracking-client-ts";
import { ProductEvent, ResultEvent } from "../recommendation/events";
import { createTrackingApi } from "../openApi";
import { Locale } from "../locale";

type GlobalStore = {
  locale: Locale;
  currencySign: string;
  pricePrefix: string;
  apiPath: string;
  trackingEnabled: boolean;
};

const globalStoreDefaults: GlobalStore = {
  locale: "de-DE",
  currencySign: "€",
  pricePrefix: "",
  apiPath: "https://api.vviinn.com",
  trackingEnabled: true,
};

const { state } = createStore(globalStoreDefaults);
export const globalState = state;

export const trackEvent = async (
  event: WidgetEvent | ProductEvent | ResultEvent,
  token: string,
  apiPath: string = "https://api.vviinn.com",
): Promise<void> => {
  if (!state.trackingEnabled || !event || !token) return;

  try {
    const trackingApi = createTrackingApi(apiPath, token);
    const result = await trackingApi.trackEvent(event);
    if (result.status === "rejected") {
      state.trackingEnabled = false;
    }
  } catch (error) {
    console.error("Tracking event error:", error);
  }
};
