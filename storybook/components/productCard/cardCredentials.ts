const cardDataSeparator = "\n    ";
const cardAppendContainer = `
<div id="product-card-append-container"></div>`;

const discoveryButtonCode = (append = false) => {
  console.log(append, "in buttonCode");
  const buttonTemplate = `
    <div slot="vviinn-product-card-actions">
        <vviinn-vpr-button
            token="TOKEN"
            product-id="PRODUCT_ID"
            mode="continuity"
            block-title=""
            locale="en-US"
            add-style="false"
        ></vviinn-vpr-button>
    </div>
`;
  if (append) {
    const bracketCloseIndex =
      buttonTemplate.indexOf("></vviinn-vpr-button>") - 1;
    return `${buttonTemplate.slice(
      0,
      bracketCloseIndex
    )}     append-sidebar-to="product-card-append-container"\n        ${buttonTemplate.slice(
      bracketCloseIndex
    )}`;
  }
  console.log("out of if");
  return buttonTemplate;
};

const cardParamsToCode = (productData) => {
  return Object.entries(productData)
    .filter(([key, value]) => typeof value !== "object")
    .map(([key, value]) => {
      if (value === "") return "";
      const stringifiedValue =
        value.toString().indexOf('"') >= 0 ? `'${value}'` : `"${value}"`;
      return `${cardDataSeparator}${key}=${stringifiedValue}`;
    })
    .join("");
};

const cardCodeFromData = (productData, buttonParams) => {
  console.log(buttonParams?.append);
  const productText = cardParamsToCode(productData);
  const productCardBasic = `<vviinn-product-card>${
    buttonParams ? discoveryButtonCode(buttonParams?.append) : "\n"
  }</vviinn-product-card>${buttonParams?.append ? cardAppendContainer : ""}`;
  const firstBracketIndex = productCardBasic.indexOf(">");
  return `${productCardBasic.slice(
    0,
    firstBracketIndex
  )}${productText}${productCardBasic.slice(firstBracketIndex)}`;
};

export const cardCredentials = (cardData) => {
  console.log(cardData?.buttonParams, cardData?.buttonParams?.append);
  const codeCardStyle = cardData.style ? `${cardData.style}\n` : "";
  const uniqueId = cardData.uniqueId;
  return {
    name: `product-card-${uniqueId}`,
    codeId: `Code_${uniqueId}`,
    previewId: `Preview_${uniqueId}`,
    style: "",
    ...cardData,
    code: `${codeCardStyle}${cardCodeFromData(
      cardData.productData,
      cardData?.buttonParams
    )}`,
  };
};
