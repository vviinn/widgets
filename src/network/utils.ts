import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import * as S from "fp-ts/Semigroup";

export const getApiPath: IO<E.Either<string, string>> = () =>
  pipe(
    `${process.env.API_PATH}`,
    O.fromNullable,
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

export const mergeInitRequests = S.getStructSemigroup<RequestInit>({
  method: S.getFirstSemigroup<string>(),
  body: S.getLastSemigroup<string>(),
  headers: headersSemigroupSum,
});
