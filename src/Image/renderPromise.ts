export const renderPromise = async (url: string): Promise<void> =>
  new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => resolve());
    image.src = url;
  });

export const imagesRenderedPromise = async (urls: string[]): Promise<void[]> =>
  Promise.all(urls.map(renderPromise));
