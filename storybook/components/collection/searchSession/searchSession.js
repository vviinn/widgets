import { pipe } from "fp-ts/lib/function";
import { makeRequest } from "../network/request";
import { createInitPostRequest, getApiPath } from "../network/utils";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { processBearerToken } from "../utils/token/tokenUtils";
import { sequenceToEither } from "../utils/either";
import { imageFormFromFile } from "../Image/form";
export const readFilters = (filters) => Object.entries(filters).map(([name, filters]) => {
  return { name, filters };
});
export const detectedObjectEq = {
  equals: (x, y) => x.class === y.class &&
    x.score === y.score &&
    x.rectangle.left === y.rectangle.left &&
    x.rectangle.top === y.rectangle.top &&
    x.rectangle.height === y.rectangle.height &&
    x.rectangle.width === y.rectangle.width,
};
export const searchSessionClient = (initialData) => pipe(sequenceToEither(getApiPath(), createInitPostRequest), TE.fromEither, TE.chainW(makeRequest("search/session", initialData)));
export const makeRequestFromFile = (token, file) => pipe(sequenceToEither(processBearerToken(token), E.right(imageFormFromFile(file))), E.map(([headers, body]) => {
  return {
    headers,
    body,
  };
}));
