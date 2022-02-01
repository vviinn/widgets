declare type ImageWidth = "width";
declare type ImageHeight = "height";
export declare type ImageDimension = {
  readonly kind: ImageWidth | ImageHeight;
  readonly size: number;
};
declare type ImageDimensions = ImageDimension[];
export declare const scaleByLargestSide: (toSize: number) => (dimensions: ImageDimensions) => ImageDimensions;
export declare const dimensionsFromImage: (image: HTMLImageElement) => ImageDimensions;
export {};
