import { createStore } from "@stencil/store";
import { DefaultApi, WidgetEvent } from "vviinn-tracking-client-ts";
import { ProductEvent, ResultEvent } from "../recommendation/events";
import { createTrackingApi } from "../openApi";
import { Locale } from "../locale";

type GlobalStore = {
  token: string | null;
  apiPath: string | null;
  locale: Locale;
  currencySign: string;
  pricePrefix: string;

  trackingEnabled: boolean;
  trackingApi: DefaultApi | null;
};

const globalStoreDefaults: GlobalStore = {
  token: null,
  apiPath: "https://api.vviinn.com",
  locale: "de-DE",
  currencySign: "€",
  pricePrefix: "",

  trackingEnabled: true,
  trackingApi: null,
};

const { state } = createStore(globalStoreDefaults);
export const globalState = state;

const initTrackingApi = (): void => {
  if (!state.trackingApi) {
    state.trackingApi = createTrackingApi(state.apiPath, state.token);
  }
};

interface ComponentWithGlobalConfig {
  apiPath?: string;
  locale?: Locale;
  currencySign?: string;
  pricePrefix?: string;
  token?: string;
}

export const updateGlobalState = (
  component: ComponentWithGlobalConfig,
): void => {
  const updates: Partial<GlobalStore> = {
    apiPath: component?.apiPath,
    locale: component?.locale,
    currencySign: component?.currencySign,
    pricePrefix: component?.pricePrefix,
    token: component?.token,
  };

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      state[key] = value;
    }
  });
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
