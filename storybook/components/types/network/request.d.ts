import * as TE from "fp-ts/lib/TaskEither";
import { RequestWithPath } from "./utils";
import { BasicError } from "../error";
export declare const request: <I>(url: string | Request, request?: RequestInit) => TE.TaskEither<Response, I>;
export declare const makeRequest: <T>(path: string, init: RequestInit) => ([apiPath, options,]: RequestWithPath) => TE.TaskEither<BasicError<Response>, T>;
