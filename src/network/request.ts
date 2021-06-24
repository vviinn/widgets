import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as E from "fp-ts/lib/Either";
import { mergeInitRequests, RequestWithPath } from "./utils";

export interface NetworkError {
  errorType: "NetworkError" | "NotFound";
  body?: unknown;
}

function errorFromUnknown(x: unknown): NetworkError {
  return {
    errorType: "NetworkError",
    body: x,
  };
}

export function networkErrorFrom<T>(x: T): NetworkError {
  return {
    errorType: "NetworkError",
    body: x,
  };
}

const getError = (x: Response): NetworkError =>
  x.status === 500
    ? { errorType: "NetworkError", body: x }
    : { errorType: "NotFound", body: x };

const safeRequest = (
  url: string | Request,
  request: RequestInit = { method: "GET" }
): TE.TaskEither<NetworkError, Response> =>
  TE.tryCatch(() => fetch(url, request), errorFromUnknown);

const processResponce = flow((x: Response): E.Either<
  NetworkError,
  Response
> => {
  return x.status >= 200 && x.status < 300 ? E.right(x) : E.left(getError(x));
}, TE.fromEither);

function getJson<I>(x: Response): TE.TaskEither<NetworkError, I> {
  const task: T.Task<I> = () => x.json();
  return TE.fromTask(task);
}

export const request = <I>(
  url: string | Request,
  request: RequestInit = {}
): TE.TaskEither<NetworkError, I> =>
  pipe(
    safeRequest(url, request),
    TE.chain(processResponce),
    TE.chain((x) => getJson<I>(x))
  );

const initRequestSemigroup = mergeInitRequests;

export const makeRequest = <T>(path: string, init: RequestInit) => ([
  apiPath,
  options,
]: RequestWithPath): TE.TaskEither<NetworkError, T> => {
  const url = new URL(path, apiPath);
  const fullOptions = initRequestSemigroup.concat(options, init);

  return request<T>(url.toString(), fullOptions);
};
