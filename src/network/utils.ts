import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import * as S from "fp-ts/Semigroup";
import state from "../store/store";

const stringMonoid = O.getFirstMonoid<string>();

export const getApiPath: IO<E.Either<string, string>> = () =>
  pipe(
    stringMonoid.concat(
      O.fromNullable(state.apiPath),
      O.fromNullable(`${process.env.API_PATH}`)
    ),
    E.fromOption(() => "api path unknown")
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
      const m = O.getFirstMonoid<string>();
      const method = m.concat(O.fromNullable(a), O.fromNullable(b));

      return pipe(
        method,
        O.getOrElse(() => "GET")
      );
    },
  },
  body: S.getLastSemigroup<string>(),
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
  method: RequestMethod
): E.Either<string, RequestInit> => E.of(createBasicRequest(method));

export const createInitGetRequest: E.Either<string, RequestInit> = E.of(
  createBasicRequest("GET")
);

export const createInitPostRequest: E.Either<string, RequestInit> = E.of(
  createBasicRequest("POST")
);
