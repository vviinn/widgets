import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
import { getApiPath, mergeInitRequests } from "./utils";
import { request, networkErrorFrom, NetworkError } from "./request";

export type RequestWithPath = [string, RequestInit];
export type RequestMethod = "GET" | "POST" | "DELETE";

const createBasicRequest = (method: RequestMethod): RequestInit => {
  return {
    method,
  };
};

const sequenceToEither = sequenceT(E.either);
const initRequestSemigroup = mergeInitRequests;

export const createInitGetRequest: E.Either<string, RequestInit> = E.of(
  createBasicRequest("GET")
);
export const createInitPostRequest: E.Either<string, RequestInit> = E.of(
  createBasicRequest("POST")
);

const makeRequest = <T>(path: string, init: RequestInit) => ([
  apiPath,
  options,
]: RequestWithPath): TE.TaskEither<NetworkError, T> => {
  const fullUrl = `${apiPath}/${path}`;
  const fullOptions = initRequestSemigroup.concat(options, init);

  return request<T>(`${fullUrl}`, fullOptions);
};

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
