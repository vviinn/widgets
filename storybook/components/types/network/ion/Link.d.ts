import { ValueObject } from "./ValueObject";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { RequestMethod } from "../utils";
export interface IonLinkParams {
  readonly [param: string]: string;
}
export declare type Link = {
  href: string;
  readonly method?: RequestMethod;
  readonly name?: string;
};
export declare const getLink: (item: ValueObject<unknown>, path: string) => O.Option<Link>;
export declare const linkRequest: <T>(link: Link) => (data: RequestInit) => TE.TaskEither<import("../../error").BasicError<Response> | import("../../error").BasicError<string>, ValueObject<T>>;
