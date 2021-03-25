import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/Apply";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import {
  getApiPath,
  RequestMethod,
  createRequestFromMethod,
  createInitPostRequest,
} from "./utils";
import { makeRequest, networkErrorFrom } from "./request";

const sequenceToEither = sequenceT(E.either);

export interface IonLink {
  readonly href: string;
  readonly method: RequestMethod;
  readonly name: string;
}

export interface IonItem<T> {
  readonly value: T;
  readonly links: {
    [link: string]: IonLink;
  };
  readonly desc: string;
  readonly type: string;
  readonly filters?: IonItem<unknown>;
}

export interface IonLinkParams {
  readonly [param: string]: string;
}

export const foldIonItem = <T>(i: IonItem<T>): T => {
  switch (i.type) {
    case "array": {
      return (i.value as any).map(foldIonItem);
    }
    default: {
      return i.value;
    }
  }
};

export const transformHref = (origin: string, params: IonLinkParams): string =>
  Object.entries(params).reduce(
    (acc, param) => acc.replace(`{${param[0]}}`, param[1]),
    origin
  );

export const searchSessionClient = (initialData: RequestInit) =>
  pipe(
    sequenceToEither(getApiPath(), createInitPostRequest),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain(makeRequest<IonItem<null>>("search/session", initialData))
  );

export const linkRequest = <T>(link: IonLink, params: IonLinkParams = {}) => (
  data: RequestInit
) =>
  pipe(
    sequenceToEither(getApiPath(), createRequestFromMethod(link.method)),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain(makeRequest<IonItem<T>>(transformHref(link.href, params), data))
  );

export const getLink = (
  item: IonItem<unknown>,
  path: string
): O.Option<IonLink> => pipe(item.links[path], O.fromNullable);
