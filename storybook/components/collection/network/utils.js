import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as S from "fp-ts/Semigroup";
import * as String from "fp-ts/string";
import state from "../store/store";
import { emptyApiPathError } from "../error";
const stringMonoid = O.getMonoid(String.Monoid);
export const getApiPath = () => pipe(O.getFirstMonoid().concat(O.fromNullable(state.apiPath), O.fromNullable(`${process.env.API_PATH}`)), E.fromOption(() => emptyApiPathError));
const headersSemigroupSum = {
  concat: (x, y) => {
    const result = new Headers();
    if (x !== undefined)
      x.forEach((val, key) => result.append(key, val));
    if (y !== undefined)
      y.forEach((val, key) => result.append(key, val));
    return result;
  },
};
export const mergeInitRequests = S.struct({
  method: {
    concat: (a, b) => {
      const method = stringMonoid.concat(O.fromNullable(a), O.fromNullable(b));
      return pipe(method, O.getOrElse(() => "GET"));
    },
  },
  body: S.last(),
  headers: headersSemigroupSum,
});
export const createBasicRequest = (method) => {
  return {
    method,
  };
};
export const createRequestFromMethod = (method) => E.right(createBasicRequest(method));
export const createInitGetRequest = E.right(createBasicRequest("GET"));
export const createInitPostRequest = E.right(createBasicRequest("POST"));
