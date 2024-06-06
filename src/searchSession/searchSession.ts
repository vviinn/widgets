import { pipe } from "fp-ts/lib/function";
import { ValueObject } from "../network/ion/ValueObject";
import { Link } from "../network/ion/Link";
import { Form } from "../network/ion/Form";
import { makeRequest } from "../network/request";
import { createInitPostRequest, getApiPath } from "../network/utils";
import { Recommendation } from "../recommendation/recommendation";
import { SearchInterfaces } from "../interfaces/search";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { RectangleAlt } from "../geometry/RectangleAlt";
import { Eq } from "fp-ts/lib/Eq";
import { BasicError } from "../error";
import { sequenceToEither } from "../utils/either";
import { arrayToQueryString } from "../utils/collections/collectionsUtils";

export type TextSearchRequestBody = SearchInterfaces["TextSearchRequest"];

type TextSearchResponse = SearchInterfaces["TextSearchResponse"];
export type ResponseFilterItem = SearchInterfaces["ResponseFilterItem"];
export type RequestFilterItem = SearchInterfaces["RequestFilterItem"];

export type SearchType = "text" | "image";

export interface SearchSessionFilters {
  readonly [key: string]: Link[];
}

export interface SearchSessionFilter {
  name: string;
  filters: Link[];
}

export const readFilters = (
  filters: SearchSessionFilters
): SearchSessionFilter[] =>
  Object.entries(filters).map(([name, filters]) => {
    return { name, filters };
  });

type HasFilters = {
  readonly filters: ValueObject<SearchSessionFilters>;
};

export type DetectedObject = {
  class: string;
  score: number;
  rectangle: RectangleAlt;
};

export const detectedObjectEq: Eq<DetectedObject> = {
  equals: (x: DetectedObject, y: DetectedObject) =>
    x.class === y.class &&
    x.score === y.score &&
    x.rectangle.left === y.rectangle.left &&
    x.rectangle.top === y.rectangle.top &&
    x.rectangle.height === y.rectangle.height &&
    x.rectangle.width === y.rectangle.width,
};

type ContainsDetectedObjects = {
  readonly detectedObjects: ValueObject<DetectedObject>[];
};

type ContainsRectangleSearch = {
  readonly searchArea: Form;
};

type ContainsHiresImageUpload = {
  readonly uploadHighResolutionImage: Form;
};

export type SearchSession = ValueObject<Recommendation[]> &
  HasFilters &
  Partial<ContainsDetectedObjects> &
  ContainsRectangleSearch &
  ContainsHiresImageUpload;

export type ObjectsDetectedEvent = CustomEvent<ValueObject<DetectedObject>[]>;

export const imageSearchSessionClient = (
  initialData: RequestInit,
  campaignId: string,
  excludedFilters: string
): TE.TaskEither<BasicError<Response | string>, SearchSession> => {
  const searchUrl = "search/session";

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
      }
    )
  );

  return pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<SearchSession>(requestUrl, initialData))
  );
};

export const textSearchSessionClient = (
  initialData: RequestInit
): TE.TaskEither<BasicError<Response | string>, TextSearchResponse> => {
  const requestUrl = "text-search";

  return pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<TextSearchResponse>(requestUrl, initialData))
  );
};
