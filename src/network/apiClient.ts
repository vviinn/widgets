import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
import {
  createInitGetRequest,
  createInitPostRequest,
  getApiPath,
} from "./utils";
import { networkErrorFrom, makeRequest } from "./request";

const sequenceToEither = sequenceT(E.Apply);

export const apiGet = <T>(path: string, data: RequestInit = {}) =>
  pipe(
    sequenceToEither(getApiPath(), createInitGetRequest),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain(makeRequest<T>(path, data))
  );

export const apiPost = <T>(path: string, data: RequestInit = {}) =>
  pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain(makeRequest<T>(path, data))
  );
