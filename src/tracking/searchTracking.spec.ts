import { trackImageSearch } from "./searchTracking";
import { getUiSessionId } from "./session";
import { campaignTypeNames } from "../campaign/Campaign";
import { BasicEventData } from "../recommendation/events";
import { SearchStoreName, useSearchStore } from "../store/search.store";

const basicEventData: BasicEventData = {
  campaignTypeId: "VPS",
  campaignTypeName: campaignTypeNames["VPS"],
  widgetVersion: "2.224.1",
  widgetId: "my-search-widget",
};

// An empty token keeps trackEvent from sending, leaving the reported event to assert on.
const track = (
  searchArea: "full" | "manual-selection",
  storeName: SearchStoreName,
) => trackImageSearch({ searchArea, storeName, token: "", basicEventData });

describe("trackImageSearch", () => {
  it("reports the search area as a VPS search event", () => {
    expect(track("manual-selection", "widget")).toEqual({
      session_id: getUiSessionId("widget"),
      source: "upload",
      search_area: "manual-selection",
      campaignTypeName: "Visual Search",
      widgetVersion: "2.224.1",
      widgetId: "my-search-widget",
      widget: "VPS",
      typ: "search_event",
    });
  });

  it("keeps one session per store realm", () => {
    expect(track("full", "widget").session_id).not.toBe(
      track("full", "components").session_id,
    );
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
