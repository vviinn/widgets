import { flow } from "fp-ts/lib/function";
const createBearerString = (x) => `Bearer ${x}`;
const createAuthedHeader = (x) => new Headers({
  Authorization: x,
});
const createFetchAuthOptions = (x) => {
  return {
    headers: x,
  };
};
export const createBearAuthedHeader = flow(createBearerString, createAuthedHeader, createFetchAuthOptions);
