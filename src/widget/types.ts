export type VisualSearchMode = "modal" | "upload" | "camera";
export type UploadSource = "uploadPhoto" | "startCamera";

export type TextSearchMode = "text" | "upload";

export type SearchBarMode = "basic" | "extended";

export type OneClickDiscoveryAppendMode =
  | "append-grid"
  | "append-slider"
  | "unset";
export type OneClickDiscoveryMode = OneClickDiscoveryAppendMode | "modal";

export const oneClickDiscoveryModes = [
  "append-grid",
  "append-slider",
  "modal",
  "unset",
];

/** How the shopper reaches the results after the first page. */
export type LoadMoreMode = "none" | "button";
