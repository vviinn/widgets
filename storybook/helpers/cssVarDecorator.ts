type CSSVarMapping = {
  argName: string;
  cssVar: string;
};

export const createCSSVarDecorator = (
  componentTag: string,
  mappings: CSSVarMapping[],
  additionalStyles?: string,
) => {
  return (story, { args }) => {
    const cssVars = mappings
      .filter((m) => args[m.argName] !== undefined && args[m.argName] !== "")
      .map((m) => `${m.cssVar}: ${args[m.argName]};`)
      .join("\n    ");

    return `
<style>
${componentTag} {
    ${cssVars}
}
${additionalStyles || ""}
</style>
${story()}
`;
  };
};

export const productCardImageAspectRatioMapping: CSSVarMapping = {
  argName: "productCardImageAspectRatio",
  cssVar: "--product-card-image-aspect-ratio",
};

export const productCardImageBgColorMapping: CSSVarMapping = {
  argName: "productCardImageBgColor",
  cssVar: "--product-card-image-bg-color",
};

export const productCardContentAlignMapping: CSSVarMapping = {
  argName: "productCardContentAlign",
  cssVar: "--product-card-content-align",
};

export const productCardTextAlignMapping: CSSVarMapping = {
  argName: "productCardTextAlign",
  cssVar: "--product-card-text-align",
};

export const productCardImageBorderMapping: CSSVarMapping = {
  argName: "productCardImageBorder",
  cssVar: "--product-card-image-border",
};
