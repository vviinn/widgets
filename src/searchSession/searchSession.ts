import { pipe } from "fp-ts/lib/function";
import { makeRequest } from "../network/request";
import { createInitPostRequest, resolveApiPath } from "../network/utils";
import * as TE from "fp-ts/TaskEither";
import { Eq } from "fp-ts/lib/Eq";
import { BasicError } from "../error";
import { sequenceToEither } from "../utils/either";
import {
  AutoSuggestResponse,
  ProductListingPageResponse,
  Rectangle,
  TextSearchResponse,
  VisualSearchResponse,
} from "../interfaces";

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

  return pipe(
    sequenceToEither(resolveApiPath(apiPath), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<VisualSearchResponse>(requestUrl, initialData)),
  );
};

export const textSearchSessionClient = (
  initialData: RequestInit,
  apiPath?: string,
): TE.TaskEither<BasicError<Response | string>, TextSearchResponse> => {
  const requestUrl = "text-search";

  return pipe(
    sequenceToEither(resolveApiPath(apiPath), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<TextSearchResponse>(requestUrl, initialData)),
  );
};

export const productListingPageSessionClient = (
  initialData: RequestInit,
  apiPath?: string,
): TE.TaskEither<BasicError<Response | string>, ProductListingPageResponse> => {
  const requestUrl = "product-listing-page";

  return pipe(
    sequenceToEither(resolveApiPath(apiPath), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<ProductListingPageResponse>(requestUrl, initialData)),
  );
};

export const autoSuggestClient = (
  initialData: RequestInit,
  apiPath?: string,
): TE.TaskEither<BasicError<Response | string>, AutoSuggestResponse> => {
  const requestUrl = "auto-suggest";

  return pipe(
    sequenceToEither(resolveApiPath(apiPath), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<AutoSuggestResponse>(requestUrl, initialData)),
  );
};
