import { Either, fromOption, left } from "fp-ts/lib/Either";
import { BasicError } from "../error";
import { findFirstMap } from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { none, some } from "fp-ts/lib/Option";
import { isWebKitEngine } from "../helpers/device/checkDeviceType";

// File types for MIME validation (file.type = "image/jpeg" -> "jpeg")
// Note: heif included because browsers may report HEIC files as "image/heif"
const SUPPORTED_FILE_TYPES = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "heic",
  "heif",
];
// HTML accept attribute value for file input
export const acceptableFileFormats = ".jpg, .jpeg, .png, .webp, .avif, .heic";

const unsupportedFileTypeError: BasicError<string> = {
  kind: "client",
  inner: "File format not supported",
};

const heicNotSupportedError: BasicError<string> = {
  kind: "client",
  inner: "HEIC format is only supported in Safari and iOS browsers",
};

export const checkImageType = (
  file: File,
): Either<BasicError<string>, File> => {
  const fileType = file.type.split("/")[1];

  if ((fileType === "heic" || fileType === "heif") && !isWebKitEngine()) {
    return left(heicNotSupportedError);
  }

  const supportedFileType = findFirstMap((supportedType: string) =>
    supportedType === fileType ? some(file) : none,
  )(SUPPORTED_FILE_TYPES);

  return pipe(
    supportedFileType,
    fromOption(() => unsupportedFileTypeError),
  );
};
