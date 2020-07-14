import * as E from 'fp-ts/lib/Either';

export const detectTouchEvent = (): E.Either<Error, TouchEvent> => E.tryCatch(
  () => new TouchEvent(''),
  (error: Error) => error
);
