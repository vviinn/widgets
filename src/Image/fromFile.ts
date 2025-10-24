import { Task } from "fp-ts/Task";

export const imageFromFileTask =
  (f: File): Task<HTMLImageElement> =>
  () =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      const image = new Image();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        image.src = e.target.result as string;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      image.onload = () => {
        resolve(image);
      };

      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      reader.readAsDataURL(f);
    });
