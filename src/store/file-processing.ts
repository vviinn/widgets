import * as O from "fp-ts/lib/Option";
import * as E from "fp-ts/lib/Either";
import { checkImageType } from "../Image/error";
import { pipe } from "fp-ts/lib/function";
import { fileDoesntExistError } from "../file";

export const checkFileWithExtention = (file: File) =>
  pipe(
    file,
    O.fromNullable,
    E.fromOption(() => fileDoesntExistError),
    E.chain(checkImageType)
  );
