import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import * as S from "fp-ts/Semigroup";
import * as String from "fp-ts/string";
import { state } from "../store/store";
import { BasicError, emptyApiPathError } from "../error";

const stringMonoid = O.getMonoid(String.Monoid);

export const getApiPath: IO<E.Either<BasicError<string>, string>> = () =>
  pipe(
    O.getFirstMonoid<string>().concat(
      O.fromNullable(state.apiPath),
      O.fromNullable(`${process.env.API_PATH}`),
    ),
    E.fromOption(() => emptyApiPathError),
  );

const headersSemigroupSum: S.Semigroup<Headers> = {
  concat: (x: Headers, y: Headers) => {
    const result = new Headers();

    if (x !== undefined) x.forEach((val, key) => result.append(key, val));
    if (y !== undefined) y.forEach((val, key) => result.append(key, val));

    return result;
  },
};

export const mergeInitRequests = S.struct<RequestInit>({
  method: {
    concat: (a: string, b: string) => {
      const method = stringMonoid.concat(O.fromNullable(a), O.fromNullable(b));

      return pipe(
        method,
        O.getOrElse(() => "GET"),
      );
    },
  },
  body: S.last<string>(),
  headers: headersSemigroupSum,
});

export type RequestWithPath = [string, RequestInit];
export type RequestMethod = "GET" | "POST" | "DELETE";

export const createBasicRequest = (method: RequestMethod): RequestInit => {
  return {
    method,
  };
};

export const createRequestFromMethod = (
  method: RequestMethod,
): E.Either<any, RequestInit> => E.right(createBasicRequest(method));

export const createInitPostRequest: E.Either<any, RequestInit> = E.right(
  createBasicRequest("POST"),
);

export const setBodyAndHeaders = E.map(([headers, body]): RequestInit => {
  headers.set("Content-Type", "application/json");
  return {
    headers,
    body,
  };
});
