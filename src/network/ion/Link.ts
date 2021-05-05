import { ValueObject } from "./ValueObject";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { sequenceT } from "fp-ts/Apply";
import { pipe } from "fp-ts/function";
import { getApiPath, RequestMethod, createRequestFromMethod } from "../utils";
import { makeRequest, networkErrorFrom } from "../request";

const sequenceToEither = sequenceT(E.either);

export interface IonLinkParams {
  readonly [param: string]: string;
}

export type Link = {
  href: string;
  // for backward compatibility
  readonly method?: RequestMethod;
  // for backward compatibility
  readonly name?: string;
};

export const getLink = (
  item: ValueObject<unknown>,
  path: string
): O.Option<Link> =>
  pipe(
    item.links,
    O.fromNullable,
    O.chain((linksObject) => O.fromNullable(linksObject[path]))
  );

export const linkRequest = <T>(link: Link) => (data: RequestInit) =>
  pipe(
    sequenceToEither(getApiPath(), createRequestFromMethod(link.method)),
    TE.fromEither,
    TE.mapLeft(networkErrorFrom),
    TE.chain(makeRequest<ValueObject<T>>(link.href, data))
  );
