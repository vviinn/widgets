const createCanvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Failed to get canvas context");
  return [canvas, context];
};

export const drawImageToCanvas = (
  img: HTMLImageElement,
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const [canvas, context] = createCanvas();
  const { naturalWidth, naturalHeight } = img;
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  context.drawImage(img, 0, 0, naturalWidth, naturalHeight);
  return [canvas, context];
};

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  quality = 0.7,
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Conversion to Blob failed"));
      },
      "image/jpeg",
      quality,
    );
  });

export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Failed to convert Blob to base64 string"));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const imageToBlob = async (
  img: HTMLImageElement,
  quality = 0.7,
): Promise<Blob> => {
  const [canvas] = drawImageToCanvas(img);
  return canvasToBlob(canvas, quality);
};

export const imageToBase64 = async (
  img: HTMLImageElement,
  quality = 0.7,
): Promise<string> => {
  const blob = await imageToBlob(img, quality);
  return blobToBase64(blob);
};

export const blobToFile = (blob: Blob, fileName = "image.jpg"): File =>
  new File([blob], fileName, { type: blob.type });
