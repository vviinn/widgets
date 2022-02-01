import * as E from "fp-ts/lib/Either";
import { BasicError } from "../../error";
export declare const createBearerHeaders: (token: string) => Headers;
export declare const checkToken: (token: string) => E.Either<BasicError<string>, string>;
export declare const processBearerToken: (token: string) => E.Either<BasicError<string>, Headers>;
