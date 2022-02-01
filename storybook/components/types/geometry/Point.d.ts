import { ClientEvent } from "../utils/event/Events";
import { Rectangle } from "./Rectangle";
export declare type Point = {
  readonly x: number;
  readonly y: number;
};
export declare const fromRectangle: ({ x, y }: Rectangle) => Point;
export declare const fromMouseEvent: ({ clientX, clientY }: ClientEvent) => Point;
export declare const fromTouchEvent: ({ touches }: TouchEvent) => Point;
export declare const pointDiffSemigroup: import("fp-ts/Semigroup").Semigroup<{
  readonly x: number;
  readonly y: number;
}>;
export declare const pointSumSemigroup: import("fp-ts/Semigroup").Semigroup<{
  readonly x: number;
  readonly y: number;
}>;
export declare const pointProductSemigroup: import("fp-ts/Semigroup").Semigroup<{
  readonly x: number;
  readonly y: number;
}>;
