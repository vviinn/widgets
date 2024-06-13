import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
import { createInitPostRequest, getApiPath } from "./utils";
import { BasicError } from "../error";
import { makeRequest } from "./request";

const sequenceToEither = sequenceT(E.Apply);

export const apiPost = <TResponse>(
  path: string,
  data: RequestInit = {}
): TE.TaskEither<BasicError<Response | string>, TResponse> =>
  pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<TResponse>(path, data))
  );
