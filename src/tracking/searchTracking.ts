import {
  SearchArea,
  SearchImageSource,
  WidgetEvent,
} from "vviinn-tracking-client-ts";

import { createImageSearchEvent } from ".";
import { getUiSessionId } from "./session";
import { BasicEventData } from "../recommendation/events";
import { resetResultEvents, SearchStoreName } from "../store/search.store";
import { trackEvent } from "../store/store";

type ImageSearchTracking = {
  searchArea: SearchArea;
  storeName: SearchStoreName;
  token: string;
  apiPath?: string;
  basicEventData: BasicEventData;
};

// Every search tracked here runs on an image the visitor brought in.
const IMAGE_SOURCE: SearchImageSource = "upload";

/**
 * Report a visual search. Call it where the search is triggered — the same call serves the
 * widget and the standalone components, which have no widget to report on their behalf.
 *
 * Also rearms the result load and view events: a new search means a new result to report.
 */
export const trackImageSearch = ({
  searchArea,
  storeName,
  token,
  apiPath,
  basicEventData,
}: ImageSearchTracking): void => {
  resetResultEvents(storeName);

  const { campaignTypeId, ...rest } = basicEventData;

  const searchEvent: WidgetEvent = createImageSearchEvent({
    session_id: getUiSessionId(storeName),
    source: IMAGE_SOURCE,
    search_area: searchArea,
    ...rest,
  });

  trackEvent(searchEvent, token, apiPath);
};
