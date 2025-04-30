import { Rectangle } from "../interfaces/search";

export const setLocalStorageItems = (
  imageSrc: string,
  detectedObjects: Rectangle[],
) => {
  if (imageSrc?.length) localStorage.setItem("vviinnCropperImageSrc", imageSrc);
  if (detectedObjects?.length)
    localStorage.setItem(
      "vviinnDetectedObjects",
      JSON.stringify(detectedObjects),
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
