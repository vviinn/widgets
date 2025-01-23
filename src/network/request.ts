import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { mergeInitRequests, RequestWithPath } from "./utils";
import { BasicError, basicErrorFromResponse } from "../error";

const safeRequest = (
  url: string | Request,
  request: RequestInit = { method: "GET" },
): TE.TaskEither<Response, Response> =>
  TE.tryCatch(
    () => fetch(url, request),
    (failedResponse: Response) => failedResponse,
  );

const processResponce = (
  response: Response,
): TE.TaskEither<Response, Response> =>
  response.status >= 200 && response.status < 300
    ? TE.right(response)
    : TE.left(response);

function getJson<I>(x: Response): TE.TaskEither<Response, I> {
  const task: T.Task<I> = () => x.json();
  return TE.fromTask(task);
}

export const request = <I>(
  url: string | Request,
  request: RequestInit = {},
): TE.TaskEither<Response, I> =>
  pipe(
    safeRequest(url, request),
    TE.chain(processResponce),
    TE.chain((x) => getJson<I>(x)),
  );

const initRequestSemigroup = mergeInitRequests;

export const makeRequest =
  <T>(path: string, init: RequestInit) =>
  ([apiPath, options]: RequestWithPath): TE.TaskEither<
    BasicError<Response>,
    T
  > => {
    const url = new URL(path, apiPath);
    const fullOptions = initRequestSemigroup.concat(options, init);

    return pipe(
      request<T>(url.toString(), fullOptions),
      TE.mapLeft(basicErrorFromResponse),
    );
  };
