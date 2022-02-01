import * as E from "fp-ts/Either";
interface Sized {
  length: number;
}
export declare const isEmpty: (x: Sized) => boolean;
export declare const existAndNotEmpty: <T extends Sized>(x: T) => E.Either<string, T>;
export {};
