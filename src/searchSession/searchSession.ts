import { pipe } from "fp-ts/lib/function";
import { ValueObject } from "../network/ion/ValueObject";
import { Link } from "../network/ion/Link";
import { Form } from "../network/ion/Form";
import { makeRequest } from "../network/request";
import { createInitPostRequest, getApiPath } from "../network/utils";
import { Recommendation } from "../recommendation/recommendation";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { RectangleAlt } from "../geometry/RectangleAlt";
import { Eq } from "fp-ts/lib/Eq";
import { BasicError } from "../error";
import { processBearerToken } from "../utils/token/tokenUtils";
import { sequenceToEither } from "../utils/either";
import { imageFormFromFile } from "../Image/form";

export type SearchSessionStatus =
  | "idle"
  | "imageSelected"
  | "imageProcessed"
  | "pending"
  | "fullfield"
  | "error";

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

export const searchSessionClient = (
  initialData: RequestInit,
  campaignId: O.Option<string> = O.none
): TE.TaskEither<BasicError<Response | string>, SearchSession> => {
  const searchUrl = "search/session";

  const requestUrl = pipe(
    campaignId,
    O.fold(
      () => searchUrl,
      (campaignId) => `${searchUrl}?campaign-id=${campaignId}`
    )
  );

  return pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.chainW(makeRequest<SearchSession>(requestUrl, initialData))
  );
};

export type ObjectsDetectedEvent = CustomEvent<ValueObject<DetectedObject>[]>;

export const makeRequestFromFile = (
  token: string,
  file: File
): E.Either<BasicError<string>, RequestInit> =>
  pipe(
    sequenceToEither(
      processBearerToken(token),
      E.right(imageFormFromFile(file))
    ),
    E.map(([headers, body]) => {
      return {
        headers,
        body,
      };
    })
  );
