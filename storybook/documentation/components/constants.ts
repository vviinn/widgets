import { generateHistogram } from "../../helpers";

export const filtersList = [
  {
    type: "categorical",
    column: "color_confirmed",
    label: "Color",
    isPrimary: true,
    values: [
      {
        value: {
          value: "beige > #C7B3A8",
          name: "beige",
          hexCode: "#C7B3A8",
          rgb: {
            red: 199,
            green: 179,
            blue: 168,
          },
          family: "beige",
        },
        label: "Beige",
        active: true,
        selected: false,
      },
      {
        value: {
          value: "blue > #339BCD",
          name: "blue",
          hexCode: "#339BCD",
          rgb: {
            red: 51,
            green: 155,
            blue: 205,
          },
          family: "blue",
        },
        label: "Blue",
        active: true,
        selected: false,
      },
      {
        value: {
          value: "blue > #A4CCE5",
          name: "blue",
          hexCode: "#A4CCE5",
          rgb: {
            red: 164,
            green: 204,
            blue: 229,
          },
          family: "blue",
        },
        label: "Blue",
        active: true,
        selected: false,
      },
      {
        value: {
          value: "brown > #483526",
          name: "brown",
          hexCode: "#483526",
          rgb: {
            red: 72,
            green: 53,
            blue: 38,
          },
          family: "brown",
        },
        label: "Brown",
        active: true,
        selected: false,
      },
    ],
  },
  {
    type: "interval",
    column: "price",
    label: "Price",
    isPrimary: true,
    full: {
      start: 39,
      end: 989,
    },
    selectedValues: [],
    suggestions: [],
    histogram: generateHistogram(
      39,
      989,
      [
        0.02, 0.04, 0.07, 0.1, 0.13, 0.16, 0.19, 0.22, 0.15, 0.1, 0.06, 0.03,
        0.02, 0.01,
      ],
    ),
  },
  {
    type: "interval",
    column: "weight",
    label: "Weight (g)",
    isPrimary: true,
    full: {
      start: 50,
      end: 2000,
    },
    selectedValues: [],
    suggestions: [],
    histogram: generateHistogram(50, 2000, [0.1, 0.15, 0.2, 0.25, 0.3, 0.2]),
  },
  {
    type: "categorical",
    column: "product_type",
    label: "Category",
    isPrimary: true,
    values: [
      {
        value: "Y2VsZWJyYXRlPlRlc3QgQnVja2V0",
        label: "Test Bucket",
        active: true,
        selected: false,
      },
      {
        value: "Y2VsZWJyYXRlPkhvY2h6ZWl0c2VpbmxhZHVuZ2Vu",
        label: "Hochzeitseinladungen",
        active: true,
        selected: false,
      },
    ],
  },
];

export const filters = JSON.stringify(filtersList);

export const extendedFilters = JSON.stringify([
  ...filtersList,
  {
    type: "categorical",
    column: "availability",
    label: "Availability",
    isPrimary: false,
    values: [
      {
        value: "in_stock",
        label: "In Stock",
        active: true,
        selected: false,
      },
      {
        value: "out_of_stock",
        label: "Out of Stock",
        active: true,
        selected: false,
      },
    ],
  },
  {
    type: "categorical",
    column: "brand",
    label: "Brand",
    isPrimary: true,
    values: [
      {
        value: "Adidas",
        label: "Adidas",
        active: true,
        selected: false,
      },
      {
        value: "Nike",
        label: "Nike",
        active: true,
        selected: false,
      },
      {
        value: "Puma",
        label: "Puma",
        active: true,
        selected: false,
      },
    ],
  },
  {
    type: "categorical",
    column: "size",
    label: "Size",
    isPrimary: true,
    values: [
      {
        value: "X",
        label: "X",
        active: true,
        selected: false,
      },
      {
        value: "XS",
        label: "XS",
        active: true,
        selected: false,
      },
    ],
  },
]);

export const energyCertificationsString = JSON.stringify([
  {
    certificationClass: "B",
    classIconUrls: {
      left: "https://cdn.vviinn.com/assets/certification/energy/AtoG/left/B.svg",
      right:
        "https://cdn.vviinn.com/assets/certification/energy/AtoG/right/B.svg",
    },
    classRange: {
      min: "A",
      max: "G",
    },
    classDataSheetUrl: "https://example.com/datasheet.pdf",
    productType: "Product Type",
  },
]);
