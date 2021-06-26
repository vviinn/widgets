import { pipe } from "fp-ts/lib/function";
import { ValueObject } from "../network/ion/ValueObject";
import { Link } from "../network/ion/Link";
import { Form } from "../network/ion/Form";
import { makeRequest, networkErrorFrom } from "../network/request";
import { createInitPostRequest, getApiPath } from "../network/utils";
import { Recommendation } from "../recommendation/recommendation";
import { sequenceT } from "fp-ts/Apply";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { RectangleAlt } from "../geometry/RectangleAlt";
import { Eq } from "fp-ts/lib/Eq";

const sequenceToEither = sequenceT(E.Apply);

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

export type SearchSession = ValueObject<Recommendation[]> &
  HasFilters &
  Partial<ContainsDetectedObjects> &
  ContainsRectangleSearch;

export const searchSessionClient = (initialData: RequestInit) =>
  pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain(makeRequest<SearchSession>("search/session", initialData))
  );

export type ObjectsDetectedEvent = CustomEvent<ValueObject<DetectedObject>[]>;
