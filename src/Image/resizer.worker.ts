import { lanczos2 } from "@rgba-image/lanczos";

export const resize = async (data: [ImageData, ImageData]) => {
  const [origin, target] = data;
  lanczos2(origin, target);
  return target;
};
