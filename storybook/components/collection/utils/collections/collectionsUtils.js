import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
export const isEmpty = (x) => x.length === 0;
const checkEmpty = (x) => isEmpty(x) ? E.left("entity is empty") : E.right(x);
export const existAndNotEmpty = (x) => pipe(x, E.fromNullable("entity not exist"), E.chain(checkEmpty));
