const cardDataSeparator = "\n    ";

const discoveryButtonCode = `
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

const cardParamsToCode = (productData) => {
  return Object.entries(productData)
    .filter(([key, value]) => typeof value !== "object")
    .map(([key, value]) => {
      if (value === "") return "";
      console.log(key, value.toString().indexOf('"'));
      const stringifiedValue = value.toString().indexOf('"')
        ? `'${value}'`
        : `"${value}"`;
      return `${cardDataSeparator}${key}=${stringifiedValue}`;
    })
    .join("");
};

const cardFromData = (productText) => {
  const productCardBasic = `<vviinn-product-card>${discoveryButtonCode}</vviinn-product-card>`;
  const firstBracketIndex = productCardBasic.indexOf(">");
  return `${productCardBasic.slice(
    0,
    firstBracketIndex
  )}${productText} ${productCardBasic.slice(firstBracketIndex)}`;
};

export const cardCredentials = (cardData) => {
  const uniqueId = cardData.uniqueId;
  return {
    name: `product-card-${uniqueId}`,
    codeId: `Code_${uniqueId}`,
    previewId: `Preview_${uniqueId}`,
    style: "",
    ...cardData,
    code: `${cardData.style ?? ""}${cardFromData(
      cardParamsToCode(cardData.productData)
    )}`,
  };
};
