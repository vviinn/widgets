import { Valueable } from "./ValueObject";

type IonFileData = {
  name: string;
  mediaType: string;
};

export type IonFile = Valueable<string> & IonFileData;

export const fileToB64 = async (f: File): Promise<string> =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });

    reader.readAsDataURL(f);
  });

export const fromFile = async (f: File): Promise<IonFile> => {
  return {
    name: f.name,
    mediaType: f.type,
    value: await fileToB64(f),
  };
};
