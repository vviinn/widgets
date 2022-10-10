import {
  ProductViewEvent,
  ProductClickEvent,
  WidgetEvent,
  FilterEvent,
  SearchEvent,
} from "vviinn-tracking-client-ts";
import { createTrackingApi } from "../openApi";

export const trackEvent = (
  apiPath: string,
  token: string | PromiseLike<string>,
  event:
    | ProductViewEvent
    | ProductClickEvent
    | WidgetEvent
    | FilterEvent
    | SearchEvent
) => {
  const client = createTrackingApi(apiPath, token);
  return client.trackEvent(event);
};
