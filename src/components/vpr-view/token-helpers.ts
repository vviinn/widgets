import { flow } from "fp-ts/lib/function";

const createBearerString = (x: string): string => `Bearer ${x}`;

const createAuthedHeader = (x: string): Headers =>
  new Headers({
    Authorization: x,
  });

const createFetchAuthOptions = (x: Headers): RequestInit => {
  return {
    headers: x,
  };
};

export const createBearAuthedHeader = flow(
  createBearerString,
  createAuthedHeader,
  createFetchAuthOptions
);
