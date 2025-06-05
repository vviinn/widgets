export type ErrorType =
  | "empty-results"
  | "server-error"
  | "wrong-aspect-ratio"
  | "wrong-format";

export const errorI18nKeys: Record<ErrorType, string> = {
  "empty-results": "emptyResultsBlock",
  "server-error": "serverErrorBlock",
  "wrong-aspect-ratio": "wrongAspectRatioBlock",
  "wrong-format": "wrongFormatBlock",
};

export const errorTypesWithTopMargin: Set<ErrorType> = new Set([
  "empty-results",
  "wrong-aspect-ratio",
]);

export const errorTypesWithText: Set<ErrorType> = new Set(["wrong-format"]);

export const errorTypesAlwaysShowButton: Set<ErrorType> = new Set([
  "server-error",
  "wrong-aspect-ratio",
  "wrong-format",
]);
