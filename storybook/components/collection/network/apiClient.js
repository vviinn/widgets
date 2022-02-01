import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
import { createInitGetRequest, createInitPostRequest, getApiPath, } from "./utils";
import { makeRequest } from "./request";
const sequenceToEither = sequenceT(E.Apply);
export const apiGet = (path, data = {}) => pipe(sequenceToEither(getApiPath(), createInitGetRequest), TE.fromEither, TE.chainW(makeRequest(path, data)));
export const apiPost = (path, data = {}) => pipe(sequenceToEither(getApiPath(), createInitPostRequest), TE.fromEither, TE.chainW(makeRequest(path, data)));
