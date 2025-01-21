import { FunctionalComponent, h } from "@stencil/core";
import { ArrowIcon } from "../vviinn-icons";

export type ArrowKind = "prev" | "next";

type ArrowProp = {
  kind: ArrowKind;
  tabindex: number;
  disabled: boolean;
  onClick: () => void;
  onKeyDown: (ev: KeyboardEvent) => void;
};

const getStyleMap = (
  data: Partial<ArrowProp>,
): { [className: string]: boolean } => {
  return {
    "arrow-wrapper": true,
    [data.kind]: true,
    disabled: data.disabled,
  };
};

export const Arrow: FunctionalComponent<ArrowProp> = ({
  kind,
  tabindex,
  disabled,
  onClick,
  onKeyDown,
}) => (
  <div
    class={getStyleMap({ kind, disabled })}
    onClick={onClick}
    tabindex={tabindex}
    onKeyDown={onKeyDown}
  >
    <ArrowIcon />
  </div>
);
