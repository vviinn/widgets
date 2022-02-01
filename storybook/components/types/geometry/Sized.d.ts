import * as Ord from "fp-ts/Ord";
export declare type Sized = {
  readonly width: number;
  readonly height: number;
};
export declare const sizedDivSemigroup: import("fp-ts/Semigroup").Semigroup<Sized>;
export declare const ordSized: Ord.Ord<Sized>;
