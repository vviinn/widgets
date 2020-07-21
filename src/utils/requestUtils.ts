import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';

import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { FetchOptions } from '../interfaces/fetch-options';

const safeGet = (url: string, options: FetchOptions = {}): TE.TaskEither<Error, Response> => TE.tryCatch(
  () => fetch(url, options),
  (reason) => new Error(String(reason))
);

const processResponce = flow(
  (x: Response): E.Either<Error, Response> => {
    return x.status === 200
      ? E.right(x)
      : E.left(Error(x.statusText))
  },
  TE.fromEither
);

const getJson = async (x: Response) => await x.json();

export const httpGet = <T>(url: string, options: FetchOptions = {}): TE.TaskEither<Error, Promise<T>> => pipe(
  safeGet(url, options),
  TE.chain(processResponce),
  TE.map(getJson)
);



