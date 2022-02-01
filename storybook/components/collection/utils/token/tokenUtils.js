import { pipe } from "fp-ts/function";
import * as E from "fp-ts/lib/Either";
import { invalidTokenError } from "../../error";
import { existAndNotEmpty } from "../collections/collectionsUtils";
export const createBearerHeaders = (token) => new Headers({
  Authorization: `Bearer ${token}`,
});
export const checkToken = (token) => pipe(token, existAndNotEmpty, E.mapLeft(() => invalidTokenError));
export const processBearerToken = (token) => pipe(token, checkToken, E.map(createBearerHeaders));
