import { Either } from "fp-ts/lib/Either";
import { BasicError } from "../error";
export declare const checkImageType: (file: File) => Either<BasicError<string>, File>;
