export const createCanvasWithContext = (): [
  HTMLCanvasElement,
  CanvasRenderingContext2D
] => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  return [canvas, context];
};
