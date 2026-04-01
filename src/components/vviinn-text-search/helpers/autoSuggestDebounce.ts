import {
  clearAutoSuggestCompletions,
  makeAutoSuggestRequest,
  setTextSearchQuery,
  SearchStoreName,
} from "../../../store/search.store";
import Timeout = NodeJS.Timeout;

const AUTO_SUGGEST_DEBOUNCE_MS = 300;

export const createAutoSuggestHandler = (
  storeName: SearchStoreName,
  token: string,
  apiPath?: string,
) => {
  let debounceTimer: Timeout;

  const handleInputChange = (value: string) => {
    setTextSearchQuery(storeName, value);
    clearTimeout(debounceTimer);

    if (!value) {
      clearAutoSuggestCompletions(storeName);
      return;
    }

    debounceTimer = setTimeout(() => {
      makeAutoSuggestRequest(storeName, value, token, apiPath);
    }, AUTO_SUGGEST_DEBOUNCE_MS);
  };

  const cancelPending = () => clearTimeout(debounceTimer);

  return { handleInputChange, cancelPending, cleanup: cancelPending };
};
