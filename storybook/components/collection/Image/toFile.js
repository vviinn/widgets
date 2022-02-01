export const toFile = async (b64data) => {
  const request = await fetch(b64data);
  const blob = await request.blob();
  return new File([blob], "image", {
    type: blob.type,
    lastModified: Date.now(),
  });
};
export const convertB64toFileTask = (b64data) => () => new Promise(async (resolve, _) => {
  const request = await fetch(b64data);
  const blob = await request.blob();
  const file = new File([blob], "image", {
    type: blob.type,
    lastModified: Date.now(),
  });
  resolve(file);
});
