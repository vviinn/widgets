import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { mergeInitRequests } from "./utils";
import { basicErrorFromResponse } from "../error";
const safeRequest = (url, request = { method: "GET" }) => TE.tryCatch(() => fetch(url, request), (failedResponse) => failedResponse);
const processResponce = (response) => response.status >= 200 && response.status < 300
  ? TE.right(response)
  : TE.left(response);
function getJson(x) {
  const task = () => x.json();
  return TE.fromTask(task);
}
export const request = (url, request = {}) => pipe(safeRequest(url, request), TE.chain(processResponce), TE.chain((x) => getJson(x)));
const initRequestSemigroup = mergeInitRequests;
export const makeRequest = (path, init) => ([apiPath, options,]) => {
  const url = new URL(path, apiPath);
  const fullOptions = initRequestSemigroup.concat(options, init);
  return pipe(request(url.toString(), fullOptions), TE.mapLeft(basicErrorFromResponse));
};
