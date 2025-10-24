export type ErrorKind = "client" | "server" | "app";

export type ErrorCode =
  | "unsupported-file-type"
  | "heic-not-supported"
  | "invalid-token"
  | "empty-api-path"
  | "unknown";

export type BasicError<T> = {
  kind: ErrorKind;
  inner: T;
  code?: ErrorCode;
};

export const basicErrorFromResponse = (
  error: Response,
): BasicError<Response> => {
  return {
    kind: "server",
    inner: error,
  };
};

export const invalidTokenError: BasicError<string> = {
  kind: "client",
  inner: "Token not exist or empty",
  code: "invalid-token",
};

export const emptyApiPathError: BasicError<string> = {
  kind: "client",
  inner: "Api path empty or missing",
  code: "empty-api-path",
};
