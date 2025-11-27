export type ErrorType =
  | "empty-results"
  | "server-error"
  | "wrong-aspect-ratio"
  | "wrong-format"
  | "heic-not-supported";

export interface ErrorTypeConfig {
  i18nKey: string;
}

export const errorTypeConfig: Record<ErrorType, ErrorTypeConfig> = {
  "empty-results": {
    i18nKey: "emptyResultsBlock",
  },
  "server-error": {
    i18nKey: "serverErrorBlock",
  },
  "wrong-aspect-ratio": {
    i18nKey: "wrongAspectRatioBlock",
  },
  "wrong-format": {
    i18nKey: "wrongFormatBlock",
  },
  "heic-not-supported": {
    i18nKey: "heicNotSupportedBlock",
  },
};
