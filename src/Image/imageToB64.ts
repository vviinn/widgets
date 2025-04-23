export const imageToB64 = (i: HTMLImageElement): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const { naturalWidth, naturalHeight } = i;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;
    ctx.drawImage(i, 0, 0, naturalWidth, naturalHeight);

    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Conversion to Blob failed"));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string); // data:image/jpeg;base64,...
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }, "image/jpeg");
  });
};
