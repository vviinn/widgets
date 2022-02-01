export const renderPromise = async (url) => new Promise((resolve) => {
  const image = new Image();
  image.addEventListener("load", () => resolve());
  image.src = url;
});
export const imagesRenderedPromise = async (urls) => Promise.all(urls.map(renderPromise));
