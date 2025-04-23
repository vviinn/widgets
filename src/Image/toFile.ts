import { Task } from "fp-ts/Task";

export const toFile = async (b64data: string): Promise<File> => {
  const request = await fetch(b64data);
  const blob = await request.blob();

  return new File([blob], "image", {
    type: blob.type,
    lastModified: Date.now(),
  });
};

export const convertB64toFileTask =
  (b64data: Promise<string>): Task<File> =>
  () => {
    return new Promise(async (resolve, _) => resolve(toFile(await b64data)));
  };
