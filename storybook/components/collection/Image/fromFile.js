export const fromFile = (f) => new Promise((resolve, _) => {
  const reader = new FileReader();
  const image = new Image();
  reader.onload = (e) => {
    image.src = e.target.result;
    resolve(image);
  };
  reader.readAsDataURL(f);
});
export const imageFromFileTask = (f) => () => new Promise((resolve, _) => {
  const reader = new FileReader();
  const image = new Image();
  reader.onload = (e) => {
    image.src = e.target.result;
  };
  image.onload = () => resolve(image);
  reader.readAsDataURL(f);
});
