import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { RequestStaticFilters } from "../../interfaces/recommendation";

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

export const parseStringToExcluded = (
  value: string,
): RequestStaticFilters["excluded"] =>
  value
    .split(";")
    .map((value) => {
      const [column, values] = value.split(":");
      return {
        column,
        values: values ? values.split(",") : [],
      };
    })
    .filter(({ column }) => !!column);

export const addIfDefined = <T>(
  key: string,
  value: T | null | undefined,
): Partial<Record<string, T>> =>
  value !== null && value !== undefined ? { [key]: value } : {};

export const addIfNotEmpty = <T extends { length: number } | object>(
  key: string,
  value: T | null | undefined,
): Partial<Record<string, T>> =>
  value && (Array.isArray(value) ? value.length : Object.keys(value).length)
    ? { [key]: value }
    : {};

export const addNestedIfNotEmpty = <T>(
  key: string,
  nested: Partial<Record<string, T>> | undefined,
): Partial<Record<string, Partial<Record<string, T>>>> =>
  nested && Object.keys(nested).length > 0 ? { [key]: nested } : {};
