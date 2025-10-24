import { Either, fromOption, left } from "fp-ts/lib/Either";
import { BasicError } from "../error";
import { findFirstMap } from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { none, some } from "fp-ts/lib/Option";
import { isWebKitEngine } from "../helpers/device/checkDeviceType";

// Browsers may report the same file as either "image/heic" or "image/heif"
const SUPPORTED_FILE_TYPES = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "heic",
  "heif",
];

const BASE_FILE_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"];

const getFormatToMime = (format: string): string => {
  // jpg and jpeg both map to image/jpeg
  return format === "jpg" ? "image/jpeg" : `image/${format}`;
};

const FORMAT_TO_MIME: Record<string, string> = Object.fromEntries(
  SUPPORTED_FILE_TYPES.map((format) => [format, getFormatToMime(format)]),
);

export const getAcceptableFileFormats = (): string => {
  const formats = isWebKitEngine()
    ? [...BASE_FILE_FORMATS, "heic"]
    : BASE_FILE_FORMATS;

  // Include both MIME types and file extensions for better browser compatibility
  const mimeTypes = formats.map((type) => FORMAT_TO_MIME[type]);
  const extensions = formats.map((type) => `.${type}`);

  return [...mimeTypes, ...extensions].join(",");
};

export const getAcceptableFileFormatsForDisplay = (): string => {
  const formats = isWebKitEngine()
    ? [...BASE_FILE_FORMATS, "heic"]
    : BASE_FILE_FORMATS;

  const formattedTypes = formats
    .filter((type) => type !== "jpeg")
    .map((type) => `.${type}`);

  const lastFormat = formattedTypes.pop();
  return `${formattedTypes.join(", ")}, or ${lastFormat}`;
};

const unsupportedFileTypeError: BasicError<string> = {
  kind: "client",
  inner: "File format not supported",
  code: "unsupported-file-type",
};

const heicNotSupportedError: BasicError<string> = {
  kind: "client",
  inner: "HEIC format is only supported in Safari and iOS browsers",
  code: "heic-not-supported",
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
