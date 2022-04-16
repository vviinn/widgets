import { Event } from "@vviinn/tracking-client-ts";
import { WidgetEventType } from "./models";

export const createTrackingEvent = (widget: WidgetEventType) => <
  T extends Event
>(
  eventData: any
): T => {
  return {
    ...eventData,
    ...widget,
  };
};
