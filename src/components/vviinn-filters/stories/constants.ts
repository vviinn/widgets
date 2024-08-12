export const filters = [
  {
    column: "brand",
    label: "Brand",
    isPrimary: true,
    values: [
      {
        value: "MAGMA",
        label: "MAGMA",
        selected: false,
      },
      {
        value: "WENKO",
        label: "WENKO",
        selected: false,
      },
    ],
  },
  {
    column: "color",
    label: "Color",
    isPrimary: true,
    values: [
      {
        value: "",
        label: "",
        selected: false,
      },
      {
        value: "",
        label: "",
        selected: false,
      },
      {
        value: "",
        label: "",
        selected: false,
      },
    ],
  },
  {
    column: "google_product_category",
    label: "Category",
    isPrimary: true,
    values: [
      {
        value: "SGVpbSAm",
        label: "Kopfkissen",
        selected: false,
      },
      {
        value: "TcO2YmVs",
        label: "Möbel",
        selected: false,
      },
    ],
  },
  {
    column: "price",
    label: "Price",
    isPrimary: true,
    full: {
      start: 3,
      end: 25,
    },
    suggestions: [
      {
        value: {
          frequency: 0.2222222238779068,
          interval: {
            start: 3,
            end: 9,
          },
        },
        label: "[3-9)",
        selected: false,
      },
      {
        value: {
          frequency: 0.2698412835597992,
          interval: {
            start: 9,
            end: 11,
          },
        },
        label: "[9-11)",
        selected: false,
      },
    ],
  },
  {
    column: "product_type",
    label: "Category",
    isPrimary: true,
    values: [
      {
        value: "LaXNzZW4",
        label: "Gefüllte Kissen",
        selected: false,
      },
      {
        value: "LaXNzZW4g",
        label: "Kissenhüllen",
        selected: false,
      },
      {
        value: "RpbGllbj",
        label: "Badematten",
        selected: false,
      },
    ],
  },
];
