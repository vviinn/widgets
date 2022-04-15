import {
  FilterEvent,
  ProductClickEvent,
  ProductViewEvent,
  SearchEvent,
  WidgetEvent,
} from "@vviinn/tracking-client-ts";
import { WidgetEventType } from "./models";

type TrackingEvent = Partial<
  | (ProductViewEvent & ProductClickEvent)
  | FilterEvent
  | SearchEvent
  | WidgetEvent
>;

type AgnosticTrackingEvent = Omit<TrackingEvent, keyof WidgetEventType>;

export const createTrackingEvent = (widget: WidgetEventType) => (
  eventData: AgnosticTrackingEvent
): TrackingEvent => {
  return {
    ...widget,
    ...eventData,
  };
};
