import { pipe } from "fp-ts/lib/function";
import { ValueObject } from "../network/ion/ValueObject";
import { makeRequest } from "../network/request";
import { createInitPostRequest, getApiPath } from "../network/utils";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { Eq } from "fp-ts/lib/Eq";
import { BasicError, emptyApiPathError } from "../error";
import { sequenceToEither } from "../utils/either";
import { arrayToQueryString } from "../utils/collections/collectionsUtils";
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

export type ObjectsDetectedEvent = CustomEvent<ValueObject<Rectangle>[]>;

export const visualSearchSessionClient = (
  initialData: RequestInit,
  campaignId: string | null,
  excludedFilters: string | null,
  apiPath?: string,
): TE.TaskEither<BasicError<Response | string>, VisualSearchResponse> => {
  const searchUrl = "visual-search";
  const requestUrl = pipe(
    O.fromNullable(campaignId),
    O.fold(
      () => {
        const params: string[] = [];
        if (excludedFilters) params.push(excludedFilters);
        const queryString = arrayToQueryString(params);

        return `${searchUrl}${queryString}`;
      },
      (campaignId) => {
        const params: string[] = [];
        if (campaignId) params.push(`campaign-id=${campaignId}`);
        if (excludedFilters) params.push(excludedFilters);
        const queryString = arrayToQueryString(params);

        return `${searchUrl}${queryString}`;
      },
    ),
  );

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
