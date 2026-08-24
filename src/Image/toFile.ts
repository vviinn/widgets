import { Task } from "fp-ts/Task";

// Expects a data URL as produced by canvas.toDataURL() — other formats decode with an empty mime type.
export const toFile = (b64data: string): File => {
  const [header, base64] = b64data.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], "image", {
    type: mime,
    lastModified: Date.now(),
  });
};

export const convertB64toFileTask =
  (b64data: string): Task<File> =>
  () =>
    Promise.resolve(toFile(b64data));
