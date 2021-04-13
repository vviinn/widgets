export interface RectangleAlt {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

export interface RectangularAlt {
  readonly kind: "rectangleAlt",
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

export function of(r: RectangleAlt): RectangularAlt {
    return {
        kind: "rectangleAlt",
        ...r
    }
}


