import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
//import * as TE from "fp-ts/lib/TaskEither";
import * as T from "fp-ts/lib/Task";
import { checkImageType } from "../Image/error";
import { pipe } from "fp-ts/lib/function";
import { fileDoesntExistError } from "../file";
import { imageFromFileTask } from "../Image/fromFile";
import { resizeImage } from "../Image/resizeImage";
import { convertB64toFileTask } from "../Image/toFile";
import { imageToB64 } from "../Image/imageToB64";

export const checkFileWithExtention = (file: File) =>
  pipe(
    file,
    O.fromNullable,
    E.fromOption(() => fileDoesntExistError),
    E.chain(checkImageType)
  );

const optionalResize = (image: HTMLImageElement, size: number) =>
  image.naturalWidth > size ? resizeImage(size, image) : imageToB64(image);

export const resizeFileTo = (size: number) => (file: File) =>
  pipe(
    file,
    imageFromFileTask,
    T.map((image) => optionalResize(image, size)),
    T.chain(convertB64toFileTask)
  );
