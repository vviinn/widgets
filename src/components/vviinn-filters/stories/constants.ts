export const filters = [
  {
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
    column: "price",
    label: "Price",
    isPrimary: true,
    full: {
      start: 0,
      end: 49,
    },
    selectedValues: [],
    suggestions: [
      {
        value: {
          frequency: 0.2083333283662796,
          interval: {
            start: 0,
            end: 3,
          },
        },
        label: "[0-3)",
        active: true,
      },
      {
        value: {
          frequency: 0.1822916716337204,
          interval: {
            start: 3,
            end: 5,
          },
        },
        label: "[3-5)",
        active: true,
      },
      {
        value: {
          frequency: 0.1927083283662796,
          interval: {
            start: 5,
            end: 7,
          },
        },
        label: "[5-7)",
        active: true,
      },
      {
        value: {
          frequency: 0.4166666567325592,
          interval: {
            start: 7,
            end: 49,
          },
        },
        label: "[7-49)",
        active: true,
      },
    ],
    histogram: [
      {
        value: {
          frequency: 0.1347150206565857,
          interval: {
            start: 0,
            end: 1,
          },
        },
        label: "[0-1)",
        active: true,
      },
      {
        value: {
          frequency: 0.07253886014223099,
          interval: {
            start: 1,
            end: 2,
          },
        },
        label: "[1-2)",
        active: true,
      },
      {
        value: {
          frequency: 0,
          interval: {
            start: 2,
            end: 3,
          },
        },
        label: "[2-3)",
        active: true,
      },
      {
        value: {
          frequency: 0.062176164239645004,
          interval: {
            start: 3,
            end: 4,
          },
        },
        label: "[3-4)",
        active: true,
      },
      {
        value: {
          frequency: 0.11917098611593246,
          interval: {
            start: 4,
            end: 5,
          },
        },
        label: "[4-5)",
        active: true,
      },
      {
        value: {
          frequency: 0.0984455943107605,
          interval: {
            start: 5,
            end: 6,
          },
        },
        label: "[5-6)",
        active: true,
      },
      {
        value: {
          frequency: 0.09326425194740295,
          interval: {
            start: 6,
            end: 7,
          },
        },
        label: "[6-7)",
        active: true,
      },
      {
        value: {
          frequency: 0.33678755164146423,
          interval: {
            start: 7,
            end: 8,
          },
        },
        label: "[7-8)",
        active: true,
      },
      {
        value: {
          frequency: 0.02590673603117466,
          interval: {
            start: 8,
            end: 9,
          },
        },
        label: "[8-9)",
        active: true,
      },
      {
        value: {
          frequency: 0.031088082119822502,
          interval: {
            start: 19,
            end: 20,
          },
        },
        label: "[19-20)",
        active: true,
      },
      {
        value: {
          frequency: 0,
          interval: {
            start: 20,
            end: 21,
          },
        },
        label: "[20-21)",
        active: true,
      },
      {
        value: {
          frequency: 0.020725388079881668,
          interval: {
            start: 48,
            end: 49,
          },
        },
        label: "[48-49)",
        active: true,
      },
    ],
  },
  {
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
