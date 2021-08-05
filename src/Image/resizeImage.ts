import { pipe } from "fp-ts/function";
import * as T from "fp-ts/Task";
import { imageFromFileTask } from "./fromFile";
import { convertB64toFileTask } from "./toFile";

export const resizeImage = (width: number, i: HTMLImageElement): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageWidth = i.naturalWidth;
  const imageHeight = i.naturalHeight;
  const ratio = imageHeight / imageWidth;
  const height = width * ratio;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(i, 0, 0, width, height);

  return canvas.toDataURL();
};

export const imageResizeTask = (width: number) => (file: File): T.Task<File> =>
  pipe(
    file,
    imageFromFileTask,
    T.map((image) => resizeImage(width, image)),
    T.chain(convertB64toFileTask)
  );
