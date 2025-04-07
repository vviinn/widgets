import { pipe } from "fp-ts/lib/function";
import { makeRequest } from "../network/request";
import { createInitPostRequest, getApiPath } from "../network/utils";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { Eq } from "fp-ts/lib/Eq";
import { BasicError, emptyApiPathError } from "../error";
import { sequenceToEither } from "../utils/either";
import {
  ProductListingPageResponse,
  Rectangle,
  TextSearchResponse,
  VisualSearchResponse,
} from "../interfaces/search";

export type SearchType = "text" | "image";

export const detectedObjectEq: Eq<Rectangle> = {
  equals: (x: Rectangle, y: Rectangle) =>
    x.left === y.left &&
    x.top === y.top &&
    x.height === y.height &&
    x.width === y.width,
};

export type ObjectsDetectedEvent = CustomEvent<Rectangle[]>;

export const visualSearchSessionClient = (
  initialData: RequestInit,
  apiPath?: string,
): TE.TaskEither<BasicError<Response | string>, VisualSearchResponse> => {
  const requestUrl = "visual-search";

  const apiPathOrError = apiPath
    ? pipe(
        O.fromNullable(apiPath),
        E.fromOption(() => emptyApiPathError),
      )
    : getApiPath();

  return pipe(
    sequenceToEither(apiPathOrError, createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<VisualSearchResponse>(requestUrl, initialData)),
  );
};

export const textSearchSessionClient = (
  initialData: RequestInit,
): TE.TaskEither<BasicError<Response | string>, TextSearchResponse> => {
  const requestUrl = "text-search";

  return pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<TextSearchResponse>(requestUrl, initialData)),
  );
};

export const productListingPageSessionClient = (
  initialData: RequestInit,
): TE.TaskEither<BasicError<Response | string>, ProductListingPageResponse> => {
  const requestUrl = "product-listing-page";

  return pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<ProductListingPageResponse>(requestUrl, initialData)),
  );
};
