import { fromOption } from "fp-ts/lib/Either";
import { findFirstMap } from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { none, some } from "fp-ts/lib/Option";
const SUPPORTED_FILE_TYPES = ["jpg", "jpeg", "png", "webp"];
const unsupportedFileTypeError = {
  kind: "client",
  inner: "File format not supported",
};
export const checkImageType = (file) => {
  const fileType = file.type.split("/")[1];
  const supportedFileType = findFirstMap((supportedType) => supportedType === fileType ? some(file) : none)(SUPPORTED_FILE_TYPES);
  return pipe(supportedFileType, fromOption(() => unsupportedFileTypeError));
};
