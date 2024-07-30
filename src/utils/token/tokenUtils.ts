import { pipe } from "fp-ts/function";
import * as E from "fp-ts/lib/Either";
import { BasicError, invalidTokenError } from "../../error";
import { existAndNotEmpty } from "../collections/collectionsUtils";
import { sequenceToEither } from "../either";

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

export const getTokenWithBody = <T>(token: string, body: T) =>
  sequenceToEither(processBearerToken(token), E.right(JSON.stringify(body)));
