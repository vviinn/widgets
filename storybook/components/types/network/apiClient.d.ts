import * as TE from "fp-ts/TaskEither";
import { BasicError } from "../error";
export declare const apiGet: <T>(path: string, data?: RequestInit) => TE.TaskEither<BasicError<string | Response>, T>;
export declare const apiPost: <T>(path: string, data?: RequestInit) => TE.TaskEither<BasicError<string | Response>, T>;
