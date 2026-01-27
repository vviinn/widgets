import { Rectangle } from "../interfaces";

export const setLocalStorageItems = (
  imageSrc: string,
  detectedObjects: Rectangle[],
) => {
  if (!imageSrc?.length) return;

  localStorage.setItem("vviinnCropperImageSrc", imageSrc);
  localStorage.setItem(
    "vviinnDetectedObjects",
    JSON.stringify(detectedObjects || []),
  );
};

export const getLocalStorageItems = () => {
  const imageSrc = localStorage.getItem("vviinnCropperImageSrc");
  const detectedObjects = localStorage.getItem("vviinnDetectedObjects");
  return {
    imageSrc,
    detectedObjects: JSON.parse(detectedObjects) as Rectangle[],
  };
};

export const cleanLocalStorage = () => {
  localStorage.removeItem("vviinnCropperImageSrc");
  localStorage.removeItem("vviinnDetectedObjects");
};
