import { Task } from "fp-ts/Task";

export const imageFromFileTask =
  (f: File): Task<HTMLImageElement> =>
  () =>
    new Promise((resolve, _) => {
      const reader = new FileReader();
      const image = new Image();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        image.src = e.target.result as string;
      };

      image.onload = () => resolve(image);

      reader.readAsDataURL(f);
    });
