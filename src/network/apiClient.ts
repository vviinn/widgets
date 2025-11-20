import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
import { createInitPostRequest, resolveApiPath } from "./utils";
import { BasicError } from "../error";
import { makeRequest } from "./request";

const sequenceToEither = sequenceT(E.Apply);

export const apiPost = <TResponse>(
  path: string,
  data: RequestInit = {},
  apiPath?: string,
): TE.TaskEither<BasicError<Response | string>, TResponse> =>
  pipe(
    sequenceToEither(resolveApiPath(apiPath), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<TResponse>(path, data)),
  );
