import { TrackedEvent } from "../tracking/models";
import { createTrackingApi } from "../openApi";
import { Locale } from "../locale";
import { DisableTrackingEvents } from "../widget/types";
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

type TrackEventOptions = {
  apiPath?: string;
  disableTrackingEvents?: DisableTrackingEvents;
};

export const trackEvent = async (
  event: TrackedEvent,
  token: string,
  {
    apiPath = defaultConfig.apiPath,
    disableTrackingEvents = "none",
  }: TrackEventOptions = {},
): Promise<void> => {
  const disabled = disableTrackingEvents === "all" || !isTrackingEnabled();

  if (disabled || !event || !token) return;

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
