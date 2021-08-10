export const imageFormFromFile = (file: File): FormData => {
  const body = new FormData();
  body.append("image", file);
  return body;
};
