import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

interface Sized {
  length: number;
}

export const isEmpty = (x: Sized): boolean => x.length === 0;

const checkEmpty = <T extends Sized>(x: T): E.Either<string, T> =>
  isEmpty(x) ? E.left("entity is empty") : E.right(x);

export const existAndNotEmpty = <T extends Sized>(x: T): E.Either<string, T> =>
  pipe(x, E.fromNullable("entity not exist"), E.chain(checkEmpty));

export const arrayToQueryString = (params: string[]) =>
  params.length ? `?${params.join("&")}` : "";

export const parseExcluded = (value: string) =>
  value
    .split(";")
    .map((value) => (value ? `excluded[]=${value}` : ""))
    .join("&");
