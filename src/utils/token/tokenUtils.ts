import { pipe } from "fp-ts/function";
import * as E from "fp-ts/lib/Either";
import { BasicError, invalidTokenError } from "../../error";
import { existAndNotEmpty } from "../collections/collectionsUtils";

export const createBearerHeaders = (token: string): Headers =>
  new Headers({
    Authorization: `Bearer ${token}`,
  });

export const checkToken = (
  token: string
): E.Either<BasicError<string>, string> =>
  pipe(
    token,
    existAndNotEmpty,
    E.mapLeft(() => invalidTokenError)
  );

export const processBearerToken = (
  token: string
): E.Either<BasicError<string>, Headers> =>
  pipe(token, checkToken, E.map(createBearerHeaders));
