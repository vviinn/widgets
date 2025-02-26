import { createStore } from "@stencil/store";
import { DefaultApi, WidgetEvent } from "vviinn-tracking-client-ts";
import { ProductEvent, ResultEvent } from "../recommendation/events";
import { createTrackingApi } from "../openApi";

type Store = {
  token: string | null;
  apiPath: string | null;

  locale: string;
  currencySign: string;
  fallbackStyles: string;
  pricePrefix: string;

  trackingEnabled: boolean;
  trackingApi: DefaultApi | null;
};

const storeDefaults: Store = {
  token: null,
  apiPath: null,

  locale: "en-US",
  currencySign: "€",
  fallbackStyles: "",
  pricePrefix: "",

  trackingEnabled: true,
  trackingApi: null,
};

export const { state, onChange } = createStore(storeDefaults);

const initTrackingApi = (): void => {
  if (!state.trackingApi) {
    state.trackingApi = createTrackingApi(state.apiPath, state.token);
  }
};

export const updateGlobalState = ({
  fallbackStyles,
  pricePrefix,
  currencySign,
  apiPath,
  token,
  locale,
}: Partial<Store>): void => {
  if (!!token) state.token = token;
  if (!!apiPath) state.apiPath = apiPath;

  if (locale?.length) state.locale = locale;
  if (fallbackStyles?.length) state.fallbackStyles = fallbackStyles;
  if (pricePrefix?.length) state.pricePrefix = pricePrefix;
  if (currencySign?.length) state.currencySign = currencySign;
};

export const trackEvent = async (
  event: WidgetEvent | ProductEvent | ResultEvent,
): Promise<void> => {
  if (!state.trackingEnabled || !event) return;
  initTrackingApi();

  try {
    const result = await state.trackingApi.trackEvent(event);
    if (result.status === "rejected") {
      state.trackingEnabled = false;
    }
  } catch (error) {
    console.error("Tracking event error:", error);
  }
};
