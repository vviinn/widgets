import { FetchOptions } from "../../network/fetchOptions";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { flow } from "fp-ts/lib/function";

const createBearerString = (x: string): string => `Bearer ${x}`;

const createAuthedHeader = (x: string): Headers =>
  new Headers({
    Authorization: x,
  });

const createFetchAuthOptions = (x: Headers): FetchOptions => {
  return {
    headers: x,
  };
};

const createFetchOptions = flow(
  createBearerString,
  createAuthedHeader,
  createFetchAuthOptions
);

const isTokenEmpty = (x: string): E.Either<Error, string> =>
  x.length === 0 ? E.left(new Error("Token is empty")) : E.right(x);

const getToken = (x: string): E.Either<Error, string> =>
  pipe(
    E.fromNullable(new Error("Token not provided"))(x),
    E.chain(isTokenEmpty)
  );

export const authOptionsFromToken = (
  x: string
): E.Either<Error, FetchOptions> =>
  pipe(getToken(x), E.map(createFetchOptions));
