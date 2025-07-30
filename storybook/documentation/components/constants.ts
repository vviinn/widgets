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
    histogram: [
      {
        value: {
          frequency: 0.019999999552965164,
          interval: {
            start: 39,
            end: 58,
          },
        },
        label: "[39-58)",
        active: true,
      },
      {
        value: {
          frequency: 0,
          interval: {
            start: 58,
            end: 77,
          },
        },
        label: "[58-77)",
        active: true,
      },
      {
        value: {
          frequency: 0.03999999910593033,
          interval: {
            start: 77,
            end: 96,
          },
        },
        label: "[77-96)",
        active: true,
      },
      {
        value: {
          frequency: 0.14000000059604645,
          interval: {
            start: 96,
            end: 115,
          },
        },
        label: "[96-115)",
        active: true,
      },
      {
        value: {
          frequency: 0.20000000298023224,
          interval: {
            start: 115,
            end: 134,
          },
        },
        label: "[115-134)",
        active: true,
      },
      {
        value: {
          frequency: 0.10000000149011612,
          interval: {
            start: 134,
            end: 153,
          },
        },
        label: "[134-153)",
        active: true,
      },
      {
        value: {
          frequency: 0.1599999964237213,
          interval: {
            start: 153,
            end: 172,
          },
        },
        label: "[153-172)",
        active: true,
      },
      {
        value: {
          frequency: 0.20000000298023224,
          interval: {
            start: 172,
            end: 191,
          },
        },
        label: "[172-191)",
        active: true,
      },
      {
        value: {
          frequency: 0.36000001430511475,
          interval: {
            start: 191,
            end: 210,
          },
        },
        label: "[191-210)",
        active: true,
      },
    ],
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
    histogram: [
      {
        value: {
          frequency: 0.1,
          interval: {
            start: 50,
            end: 200,
          },
        },
        label: "[50-200)",
        active: true,
      },
      {
        value: {
          frequency: 0.15,
          interval: {
            start: 200,
            end: 500,
          },
        },
        label: "[200-500)",
        active: true,
      },
      {
        value: {
          frequency: 0.2,
          interval: {
            start: 500,
            end: 1000,
          },
        },
        label: "[500-1000)",
        active: true,
      },
      {
        value: {
          frequency: 0.25,
          interval: {
            start: 1000,
            end: 1500,
          },
        },
        label: "[1000-1500)",
        active: true,
      },
      {
        value: {
          frequency: 0.3,
          interval: {
            start: 1500,
            end: 1750,
          },
        },
        label: "[1500-1750)",
        active: true,
      },
      {
        value: {
          frequency: 0.2,
          interval: {
            start: 1750,
            end: 2000,
          },
        },
        label: "[1750-2000)",
        active: true,
      },
    ],
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
    classDataSheetUrl:
      "https://www.roller.de/medias/sys_master/datasheets/datasheets/h7a/hc5/11687118700574/1328023300-P01.pdf",
    productType: "Product Type",
  },
]);

export const imageURLExample =
  "https://cdn.vviinn.com/assets/merchant/default/cropper-chair-example.jpg";

export const detectedObjectsStringExample =
  '[{"value":{"classId":96,"class":"Chair","score":98,"rectangle":{"left":0.12358226627111435,"top":0.25867345929145813,"width":0.6543737053871155,"height":0.6931518316268921}},"links":{"rectangle":{"method":"GET","href":"/search/session/674ef5744ce528-88930337?left=0.12358226627111&top=0.25867345929146&width=0.65437370538712&height=0.69315183162689"}}},{"value":{"classId":365,"class":"Picture frame","score":98,"rectangle":{"left":0.15887707471847534,"top":0,"width":0.43178221583366394,"height":0.2065306007862091}},"links":{"rectangle":{"method":"GET","href":"/search/session/674ef5744ce528-88930337?left=0.15887707471848&top=0&width=0.43178221583366&height=0.20653060078621"}}}]';
