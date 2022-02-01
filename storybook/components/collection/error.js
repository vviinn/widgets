export const basicErrorFromResponse = (error) => {
  return {
    kind: "server",
    inner: error,
  };
};
export const invalidTokenError = {
  kind: "client",
  inner: "Token not exist or empty",
};
export const emptyApiPathError = {
  kind: "client",
  inner: "Api path empty or missing",
};
