export type VisualSearchMode = "modal" | "upload" | "camera";
export type UploadSource = "uploadPhoto" | "startCamera";

export type TextSearchMode = "text" | "upload";

export type OneClickDiscoveryAppendMode = "append-grid" | "append-slider";
export type OneClickDiscoveryResultsMode =
  | OneClickDiscoveryAppendMode
  | "modal";
export type OneClickDiscoveryMode = OneClickDiscoveryResultsMode | "standalone";
