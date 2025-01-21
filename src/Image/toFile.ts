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
  (b64data: string): Task<File> =>
  () =>
    new Promise(async (resolve, _) => {
      const request = await fetch(b64data);
      const blob = await request.blob();
      const file = new File([blob], "image", {
        type: blob.type,
        lastModified: Date.now(),
      });

      resolve(file);
    });
