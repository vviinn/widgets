import { FetchOptions } from "./fetchOptions";
import { flow } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import * as E from "fp-ts/lib/Either";

const safeRequest = (
  url: string,
  options: FetchOptions = {}
): TE.TaskEither<Error, Response> =>
  TE.tryCatch(
    () => fetch(url, options),
    (reason) => new Error(String(reason))
  );

const processResponce = flow((x: Response): E.Either<Error, Response> => {
  return x.status === 200 ? E.right(x) : E.left(Error(x.statusText));
}, TE.fromEither);

function getJson<I>(x: Response): TE.TaskEither<Error, I> {
  const task: T.Task<I> = () => x.json();
  return TE.fromTask(task);
}

export const request = <T>(
  url: string,
  options: FetchOptions = {}
): TE.TaskEither<Error, T> =>
  pipe(
    safeRequest(url, options),
    TE.chain(processResponce),
    TE.chain((x) => getJson<T>(x))
  );
