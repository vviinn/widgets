export const fromFile = (f: File): Promise<HTMLImageElement> =>
  new Promise((resolve, _) => {
    const reader = new FileReader();
    const image = new Image();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      image.src = e.target.result as string;
      resolve(image);
    };

    reader.readAsDataURL(f);
  });
