export const toFile = async (b64data: string): Promise<File> => {
  const request = await fetch(b64data);
  const blob = await request.blob();

  return new File([blob], "image", {
    type: blob.type,
    lastModified: Date.now(),
  });
};
