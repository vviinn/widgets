export const fileToB64 = async (f) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    resolve(reader.result);
  });
  reader.readAsDataURL(f);
});
export const fromFile = async (f) => {
  return {
    name: f.name,
    mediaType: f.type,
    value: await fileToB64(f),
  };
};
