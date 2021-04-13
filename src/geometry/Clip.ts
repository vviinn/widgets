import { Rectangular } from "./Rectangle";
import { RectangularAlt } from "./RectangleAlt";
import { Sized } from "./Sized";
import * as Ord from "fp-ts/Ord";

export interface Clip {
  readonly top: string;
  readonly right: string;
  readonly bottom: string;
  readonly left: string;
}

const clipRectangle = (shape: Rectangular, target: Sized): Clip | null => {
  const top = `${shape.position.y}px`;
  const left = `${shape.position.x}px`;
  const right = `${target.width - (shape.position.x + shape.width)}px`;
  const bottom = `${target.height - (shape.position.y + shape.height)}px`;
  return {
    top,
    right,
    bottom,
    left,
  };
};

const clipRectangleAlt = (shape: RectangularAlt, target: Sized): Clip => {
  const t = target.height * shape.top;
  const l = target.width * shape.left;
  const w = target.width * shape.width;
  const h = target.height * shape.height;
  const top = `${t}px`;
  const left = `${l}px`;
  const right = `${target.width - (l + w)}px`;
  const bottom = `${target.height - (t + h)}px`;
  return {
    top,
    right,
    bottom,
    left,
  };
};

export type ClipShape = Rectangular | RectangularAlt;

export const ordClipShape: Ord.Ord<ClipShape> = Ord.contramap<
  number,
  ClipShape
>((s) => s.width)(Ord.ordNumber);

const getClipFromShape = (shape: ClipShape, target: Sized): Clip => {
  switch (shape.kind) {
    case "rectangle":
      return clipRectangle(shape, target);
    case "rectangleAlt":
      return clipRectangleAlt(shape, target);
  }
};

const printClip = (clip: Clip): string =>
  `inset(${clip.top} ${clip.right} ${clip.bottom} ${clip.left})`;

export const getClipValue = (shape: ClipShape, target: Sized): string =>
  printClip(getClipFromShape(shape, target));
