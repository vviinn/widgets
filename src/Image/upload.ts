/**
 * Create a File object from an image URL for upload
 */
export const createImageFile = async (imageUrl: string): Promise<File> => {
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();
  return new File([imageBlob], "image.jpg", {
    type: "image/jpeg",
  });
};