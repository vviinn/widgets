import { Point } from "./Point";
import { Handler } from "../cropper/Handler";
import { Sized } from "./Sized";
import { RectangleAlt } from "./RectangleAlt";
export declare type Rectangle = Point & Sized;
interface RectangleTransform {
  (x: Rectangle, y: Handler): Rectangle;
}
export declare const move: (origin: Rectangle, position: Point) => Rectangle;
export declare const transformNorthWest: (origin: Rectangle, handler: Handler) => Rectangle;
export declare const transform: RectangleTransform;
export declare const fromImage: (image: HTMLImageElement) => Rectangle;
export declare const fromNaturalImage: (image: HTMLImageElement) => Rectangle;
export declare const getScaleRange: (source: Rectangle, target: Rectangle) => Point;
export declare const scaleSelection: (source: Rectangle, sourceSelection: Rectangle, target: Rectangle) => Rectangle;
export declare const fromAlt: (r: RectangleAlt) => Rectangle;
export declare const scaleWithSized: (s: Sized) => (r: Rectangle) => Rectangle;
export declare const divideOnSized: (s: Sized) => (r: Rectangle) => Rectangle;
export declare const center: (r: Rectangle) => Point;
export {};
