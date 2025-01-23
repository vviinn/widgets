import { ValueObject } from "./ValueObject";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { getApiPath, RequestMethod, createRequestFromMethod } from "../utils";
import { makeRequest } from "../request";
import { sequenceToEither } from "../../utils/either";

export interface IonLinkParams {
  readonly [param: string]: string;
}

export type Link = {
  href: string;
  clear?: Link;
  // for backward compatibility
  readonly method?: RequestMethod;
  // for backward compatibility
  readonly name?: string;
};

export const getLink = (
  item: ValueObject<unknown>,
  path: string,
): O.Option<Link> =>
  pipe(
    item.links,
    O.fromNullable,
    O.chain((linksObject) => O.fromNullable(linksObject[path])),
  );

export const createLinkfromHref = (href: string): Link => ({
  href,
});

export const extractHrefValue = (link: O.Option<Link>): string =>
  pipe(
    link,
    O.map((l) => l.href),
    O.getOrElse(() => null),
  );

export const linkRequest =
  <T>(link: Link) =>
  (data: RequestInit) =>
    pipe(
      sequenceToEither(getApiPath(), createRequestFromMethod(link.method)),
      TE.fromEither,
      TE.chainW(makeRequest<ValueObject<T>>(link.href, data)),
    );
