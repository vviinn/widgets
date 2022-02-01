export const imageFormFromFile = (file) => {
  const body = new FormData();
  body.append("image", file);
  return body;
};
