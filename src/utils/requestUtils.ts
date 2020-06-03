import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';


import { flow } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';

const safeGet = (url: string): TE.TaskEither<Error, Response> => TE.tryCatch(
  () => fetch(url),
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

export const httpGet = (url: string): TE.TaskEither<Error, Promise<any>> => pipe(
  safeGet(url),
  TE.chain(processResponce),
  TE.map(getJson)
);



