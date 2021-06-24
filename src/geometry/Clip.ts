import { Rectangle } from "./Rectangle";
import { Sized } from "./Sized";

interface Clip {
  readonly top: string;
  readonly right: string;
  readonly bottom: string;
  readonly left: string;
}

const fromRectangle = (shape: Rectangle, target: Sized): Clip => {
  const top = `${shape.y}px`;
  const left = `${shape.x}px`;
  const right = `${target.width - (shape.x + shape.width)}px`;
  const bottom = `${target.height - (shape.y + shape.height)}px`;

  console.log(shape, target);

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
