import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import * as T from "fp-ts/lib/Task";
import { checkImageType } from "../Image/error";
import { pipe } from "fp-ts/lib/function";
import { fileDoesntExistError } from "../file";
import { imageFromFileTask } from "../Image/fromFile";
import { convertB64toFileTask } from "../Image/toFile";
import { optionalResize } from "./image-processing";

export const checkFileWithExtention = (file: File) =>
  pipe(
    O.fromNullable(file),
    E.fromOption(() => fileDoesntExistError),
    E.chain(checkImageType),
  );

export const resizeFileTo = (size: number) => (file: File) =>
  pipe(
    file,
    imageFromFileTask,
    T.map((image) => optionalResize(image, size)),
    T.chain(convertB64toFileTask),
  );
