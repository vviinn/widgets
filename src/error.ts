export type BasicError<T> = {
  kind: "client" | "server" | "app";
  inner: T;
};
b;
export const basicErrorFromResponse = (
  error: Response
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
