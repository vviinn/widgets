import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
export declare const checkFileWithExtention: (file: File) => E.Either<import("../error").BasicError<string>, File>;
export declare const resizeFileTo: (size: number) => (file: File) => T.Task<File>;
