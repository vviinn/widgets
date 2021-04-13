import { pipe } from "fp-ts/lib/pipeable";
import { IonItem, IonLink } from "../network/ionClient";
import { makeRequest, networkErrorFrom } from "../network/request";
import { createInitPostRequest, getApiPath } from "../network/utils";
import { Recommendation } from "../recommendation/recommendation";
import { sequenceT } from "fp-ts/Apply";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import { RectangleAlt } from "../geometry/RectangleAlt";

const sequenceToEither = sequenceT(E.either);

export interface SearchSessionFilters {
  readonly [key: string]: IonLink[];
}

export interface SearchSessionFilter {
  name: string;
  filters: IonLink[];
}

export const readFilters = (
  filters: SearchSessionFilters
): SearchSessionFilter[] =>
  Object.entries(filters).map(([name, filters]) => {
    return { name, filters };
  });

type Filterable = {
  readonly filters: IonItem<SearchSessionFilters>;
};

export type DetectedObject = {
  class: string;
  score: number;
  rectangle: RectangleAlt;
};

type WithRectangle = {
  readonly detectedObjects: DetectedObject[];
};

export type IonSearchSession = IonItem<Recommendation[]> &
  Filterable &
  WithRectangle;

export const searchSessionClient = (initialData: RequestInit) =>
  pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain(makeRequest<IonSearchSession>("search/session", initialData))
  );
