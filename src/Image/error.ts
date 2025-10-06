import { Either, fromOption } from "fp-ts/lib/Either";
import { BasicError } from "../error";
import { findFirstMap } from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { none, some } from "fp-ts/lib/Option";

const SUPPORTED_FILE_TYPES = ["jpg", "jpeg", "png", "webp", "avif"];

const unsupportedFileTypeError: BasicError<string> = {
  kind: "client",
  inner: "File format not supported",
};

export const checkImageType = (
  file: File,
): Either<BasicError<string>, File> => {
  const fileType = file.type.split("/")[1];
  const supportedFileType = findFirstMap((supportedType: string) =>
    supportedType === fileType ? some(file) : none,
  )(SUPPORTED_FILE_TYPES);

  return pipe(
    supportedFileType,
    fromOption(() => unsupportedFileTypeError),
  );
};
