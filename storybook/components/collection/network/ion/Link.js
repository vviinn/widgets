import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { getApiPath, createRequestFromMethod } from "../utils";
import { makeRequest } from "../request";
import { sequenceToEither } from "../../utils/either";
export const getLink = (item, path) => pipe(item.links, O.fromNullable, O.chain((linksObject) => O.fromNullable(linksObject[path])));
export const linkRequest = (link) => (data) => pipe(sequenceToEither(getApiPath(), createRequestFromMethod(link.method)), TE.fromEither, TE.chainW(makeRequest(link.href, data)));
