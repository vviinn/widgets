import { v4 as uuidv4 } from "uuid";

import { SearchStoreName } from "../store/search.store";

const sessionIds = new Map<SearchStoreName, string>();

/**
 * Tracking session shared by all components of one search store realm, so a search and the
 * result and product events it leads to arrive under the same session_id. Widgets outside the
 * search store, such as VPR, keep their own session.
 */
export const getUiSessionId = (storeName: SearchStoreName): string => {
  const existing = sessionIds.get(storeName);
  if (existing) return existing;

  const sessionId = uuidv4();
  sessionIds.set(storeName, sessionId);
  return sessionId;
};
