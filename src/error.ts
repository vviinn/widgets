export type ErrorKind = "client" | "server" | "app";

export type BasicError<T> = {
  kind: ErrorKind;
  inner: T;
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
};

export const emptyApiPathError: BasicError<string> = {
  kind: "client",
  inner: "Api path empty or missing",
};

export const detectObjectsError: BasicError<string> = {
  kind: "server",
  inner: "Can not get a link for objects detection",
};
