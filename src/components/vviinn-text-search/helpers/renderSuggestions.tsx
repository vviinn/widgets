import { h } from "@stencil/core";
import { QueryCompletion } from "../../../interfaces";

const highlightMatch = (suggestion: string, query: string) => {
  const lowerSuggestion = suggestion.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerSuggestion.indexOf(lowerQuery);

  if (matchIndex === -1) return suggestion;

  const before = suggestion.slice(0, matchIndex);
  const match = suggestion.slice(matchIndex, matchIndex + query.length);
  const after = suggestion.slice(matchIndex + query.length);

  return [
    before,
    <span class="suggestion-highlight">{match}</span>,
    after,
  ];
};

export const renderSuggestions = (
  completions: QueryCompletion[],
  query: string,
  activeIndex: number,
  onSelect: (completion: QueryCompletion) => void,
) => {
  if (!completions.length || !query) return null;

  return (
    <ul class="suggestions-container" part="suggestions-container" role="listbox">
      {completions.map((completion, index) => (
        <li
          class={{ "suggestion-item": true, "suggestion-item--active": index === activeIndex }}
          part="suggestion-item"
          role="option"
          aria-selected={index === activeIndex ? "true" : "false"}
          onMouseDown={(e: MouseEvent) => {
            e.preventDefault();
            onSelect(completion);
          }}
        >
          {highlightMatch(completion.suggestion, query)}
        </li>
      ))}
    </ul>
  );
};
