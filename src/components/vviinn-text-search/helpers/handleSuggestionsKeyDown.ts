import { QueryCompletion } from "../../../interfaces";
import {
  setTextSearchQuery,
  SearchStoreName,
} from "../../../store/search.store";

type SuggestionsKeyDownParams = {
  completions: QueryCompletion[];
  activeSuggestionIndex: number;
  originalQuery: string;
  storeName: SearchStoreName;
  textSearchQuery: string;
  onActiveIndexChange: (index: number) => void;
  onOriginalQueryChange: (query: string) => void;
  onSelectSuggestion: (completion: QueryCompletion) => void;
  onHideSuggestions: () => void;
  onSearch: () => void;
};

export const handleSuggestionsKeyDown = (
  event: KeyboardEvent,
  params: SuggestionsKeyDownParams,
) => {
  const {
    completions,
    activeSuggestionIndex,
    originalQuery,
    storeName,
    textSearchQuery,
    onActiveIndexChange,
    onOriginalQueryChange,
    onSelectSuggestion,
    onHideSuggestions,
    onSearch,
  } = params;

  const hasSuggestions = completions.length > 0;

  switch (event.key) {
    case "ArrowDown":
      if (hasSuggestions) {
        event.preventDefault();
        if (activeSuggestionIndex === -1) {
          onOriginalQueryChange(textSearchQuery);
        }
        const nextIndex = Math.min(
          activeSuggestionIndex + 1,
          completions.length - 1,
        );
        onActiveIndexChange(nextIndex);
        setTextSearchQuery(storeName, completions[nextIndex].suggestion);
      }
      break;
    case "ArrowUp":
      if (hasSuggestions && activeSuggestionIndex > -1) {
        event.preventDefault();
        const prevIndex = activeSuggestionIndex - 1;
        onActiveIndexChange(prevIndex);
        const newQuery =
          prevIndex === -1 ? originalQuery : completions[prevIndex].suggestion;
        setTextSearchQuery(storeName, newQuery);
      }
      break;
    case "Escape":
      onHideSuggestions();
      break;
    case "Enter":
      if (hasSuggestions && activeSuggestionIndex >= 0) {
        event.preventDefault();
        onSelectSuggestion(completions[activeSuggestionIndex]);
      } else {
        onSearch();
      }
      break;
  }
};
