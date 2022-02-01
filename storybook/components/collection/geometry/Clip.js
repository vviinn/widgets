const fromRectangle = (shape, target) => {
  const top = `${shape.y}px`;
  const left = `${shape.x}px`;
  const right = `${target.width - (shape.x + shape.width)}px`;
  const bottom = `${target.height - (shape.y + shape.height)}px`;
  return {
    top,
    right,
    bottom,
    left,
  };
};
const printClip = (clip) => `inset(${clip.top} ${clip.right} ${clip.bottom} ${clip.left})`;
export const getClipValue = (shape, target) => printClip(fromRectangle(shape, target));
