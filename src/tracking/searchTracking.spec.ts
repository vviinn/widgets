import { SearchArea, WidgetEvent } from "vviinn-tracking-client-ts";

import { trackImageSearch } from "./searchTracking";
import { campaignTypeNames } from "../campaign/Campaign";
import { BasicEventData } from "../recommendation/events";
import { SearchStoreName, useSearchStore } from "../store/search.store";
import * as store from "../store/store";

const basicEventData: BasicEventData = {
  campaignTypeId: "VPS",
  campaignTypeName: campaignTypeNames["VPS"],
  widgetVersion: "2.224.1",
  widgetId: "my-search-widget",
};

const trackEvent = jest.spyOn(store, "trackEvent").mockResolvedValue(undefined);

const track = (searchArea: SearchArea, storeName: SearchStoreName) =>
  trackImageSearch({ searchArea, storeName, token: "token", basicEventData });

const reportedEvent = () =>
  trackEvent.mock.calls[trackEvent.mock.calls.length - 1][0] as WidgetEvent;

describe("trackImageSearch", () => {
  beforeEach(() => trackEvent.mockClear());

  it("reports the search area as a VPS search event", () => {
    track("manual-selection", "widget");

    expect(trackEvent).toHaveBeenCalledWith(
      {
        session_id: expect.any(String),
        source: "upload",
        search_area: "manual-selection",
        campaignTypeName: "Visual Search",
        widgetVersion: "2.224.1",
        widgetId: "my-search-widget",
        widget: "VPS",
        typ: "search_event",
      },
      "token",
      undefined,
    );
  });

  it("keeps one session per store realm", () => {
    track("full", "widget");
    const widgetSession = reportedEvent().session_id;

    track("full", "components");

    expect(reportedEvent().session_id).not.toBe(widgetSession);
  });

  it("arms the result events of the search it reports", () => {
    const { state } = useSearchStore(false);
    state.resultLoaded = true;
    state.resultViewed = true;

    track("full", "components");

    expect(state.resultLoaded).toBe(false);
    expect(state.resultViewed).toBe(false);
  });
});
