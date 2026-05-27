import {
  makeAutoSuggestRequest,
  setTextSearchQuery,
  SearchStoreName,
} from "../../../store/search.store";
import { QueryCompletion } from "../../../interfaces";
import Timeout = NodeJS.Timeout;

const AUTO_SUGGEST_DEBOUNCE_MS = 300;

export const createAutoSuggestHandler = (
  storeName: SearchStoreName,
  token: string,
  apiPath: string | undefined,
  onCompletions: (completions: QueryCompletion[]) => void,
) => {
  let debounceTimer: Timeout;

  const handleInputChange = (value: string) => {
    setTextSearchQuery(storeName, value);
    clearTimeout(debounceTimer);

    if (!value) {
      onCompletions([]);
      return;
    }

    debounceTimer = setTimeout(() => {
      makeAutoSuggestRequest(storeName, value, token, apiPath, onCompletions);
    }, AUTO_SUGGEST_DEBOUNCE_MS);
  };

  const cancelPending = () => clearTimeout(debounceTimer);

  return { handleInputChange, cancelPending, cleanup: cancelPending };
};
