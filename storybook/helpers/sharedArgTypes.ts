export const productCardImageAspectRatioArg = {
  description: "Image aspect ratio for product cards",
  options: ["1 / 1", "3 / 4", "2 / 3"],
  control: {
    type: "select",
    labels: {
      "1 / 1": "Square (1:1)",
      "3 / 4": "Portrait (3:4)",
      "2 / 3": "Tall Portrait (2:3)",
    },
  },
};

export const productCardImageBgColorArg = {
  description: "Background color overlay for product images",
  control: { type: "color" },
};
