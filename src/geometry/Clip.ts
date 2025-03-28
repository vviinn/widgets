import { Rectangle } from "../interfaces/search";
import { Sized } from "./Sized";

interface Clip {
  readonly top: string;
  readonly right: string;
  readonly bottom: string;
  readonly left: string;
}

const fromRectangle = (shape: Rectangle, target: Sized): Clip => {
  const top = `${shape.top}px`;
  const left = `${shape.left}px`;
  const right = `${target.width - (shape.left + shape.width)}px`;
  const bottom = `${target.height - (shape.top + shape.height)}px`;

  return {
    top,
    right,
    bottom,
    left,
  };
};

const printClip = (clip: Clip): string =>
  `inset(${clip.top} ${clip.right} ${clip.bottom} ${clip.left})`;

export const getClipValue = (shape: Rectangle, target: Sized): string =>
  printClip(fromRectangle(shape, target));
