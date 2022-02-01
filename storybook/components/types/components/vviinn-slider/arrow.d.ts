import { FunctionalComponent } from "../../stencil-public-runtime";
export declare type ArrowKind = "prev" | "next";
declare type ArrowProp = {
  kind: ArrowKind;
  tabindex: number;
  disabled: boolean;
  onClick: () => void;
  onKeyDown: (ev: KeyboardEvent) => void;
};
export declare const Arrow: FunctionalComponent<ArrowProp>;
export {};
