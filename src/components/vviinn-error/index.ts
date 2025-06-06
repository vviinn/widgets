export type ErrorType =
  | "empty-results"
  | "server-error"
  | "wrong-aspect-ratio"
  | "wrong-format";

export interface ErrorTypeConfig {
  i18nKey: string;
  hasTopMargin: boolean;
  hasText: boolean;
  hasButton: boolean;
}

export const errorTypeConfig: Record<ErrorType, ErrorTypeConfig> = {
  "empty-results": {
    i18nKey: "emptyResultsBlock",
    hasTopMargin: true,
    hasText: false,
    hasButton: false,
  },
  "server-error": {
    i18nKey: "serverErrorBlock",
    hasTopMargin: false,
    hasText: false,
    hasButton: true,
  },
  "wrong-aspect-ratio": {
    i18nKey: "wrongAspectRatioBlock",
    hasTopMargin: true,
    hasText: false,
    hasButton: true,
  },
  "wrong-format": {
    i18nKey: "wrongFormatBlock",
    hasTopMargin: false,
    hasText: true,
    hasButton: true,
  },
};
