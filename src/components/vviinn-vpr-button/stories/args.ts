export const argTypes = {
  buttonSize: {
    name: "Button size",
    options: ["Default", "Small", "Large"],
    mapping: {
      Default: 40,
      Small: 32,
      Large: 48,
    },
    control: {
      type: "select",
      labels: {
        Default: "Default (40px)",
        Small: "Small (32px)",
        Large: "Large (48px)",
      },
    },
    defaultValue: "Default",
  },
  iconColor: {
    name: "Icon color",
    control: {
      type: "color",
    },
    defaultValue: "#000000",
  },
  backgroundColor: {
    name: "Background color",
    control: {
      type: "color",
    },
    defaultValue: "#ffffff",
  },
  backgroundOpacity: {
    name: "Background opacity (%)",
    control: {
      type: "number",
    },
    defaultValue: 100,
  },
  radius: {
    name: "Radius (px)",
    control: {
      type: "number",
    },
    defaultValue: 20,
  },
  border: {
    name: "Border",
    control: {
      type: "boolean",
    },
    defaultValue: false,
  },
  borderColor: {
    name: "Border color",
    control: {
      type: "color",
    },
    defaultValue: "#cccccc",
  },
  shadow: {
    name: "Shadow",
    control: {
      type: "boolean",
    },
    defaultValue: true,
  },
  position: {
    name: "Modal container appearance",
    options: ["bottom", "right"],
    control: {
      type: "select",
      labels: {
        bottom: "From bottom",
        right: "From right",
      },
    },
    defaultValue: "bottom",
  },
  backdropOpacity: {
    name: "Backdrop opacity (%)",
    control: {
      type: "number",
    },
    defaultValue: 50,
  },
  sidebarBorderRadius: {
    name: "Modal container round corners (px)",
    control: {
      type: "number",
    },
    defaultValue: 16,
  },
  showSourceImage: {
    name: "Modal container show source image",
    control: {
      type: "boolean",
    },
    defaultValue: true,
  },
  sourceImageSize: {
    name: "Source image size",
    options: ["Default", "Small", "Large"],
    mapping: {
      Default: 64,
      Small: 48,
      Large: 80,
    },
    control: {
      type: "select",
      labels: {
        Default: "Default (64px)",
        Small: "Small (48px)",
        Large: "Large (80px)",
      },
    },
    defaultValue: "Default",
  },
  sourceImageBorder: {
    name: "Source image border",
    control: {
      type: "boolean",
    },
    defaultValue: false,
  },
  sourceImageBorderColor: {
    name: "Source image border color",
    control: {
      type: "color",
    },
    defaultValue: "#cccccc",
  },
  sourceImageShadow: {
    name: "Source image shadow",
    control: {
      type: "boolean",
    },
    defaultValue: true,
  },
  font: {
    name: "Font family",
    options: ["Inter", "System", "Arial"],
    mapping: {
      Inter: "'Inter', sans-serif",
      System: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      Arial: "Arial, sans-serif",
    },
    control: {
      type: "select",
      labels: {
        Inter: "Inter",
        System: "System stack",
        Arial: "Arial (web safe)",
      },
    },
    defaultValue: "Inter",
  },
  primaryTextColor: {
    name: "Primary text color",
    control: {
      type: "color",
    },
    defaultValue: "#161616",
  },
  secondaryTextColor: {
    name: "Secondary text color",
    control: {
      type: "color",
    },
    defaultValue: "#757575",
  },
  modalTitle: {
    name: "Modal container title",
    control: {
      type: "boolean",
    },
    defaultValue: true,
  },
  sidebarTitle: {
    name: "Modal container title name",
    control: {
      type: "text",
    },
    defaultValue: "Visually similar products",
  },
  modalTitleFontSize: {
    name: "Modal container title font size (px)",
    control: {
      type: "number",
    },
    defaultValue: 28,
  },
  modalScrollbar: {
    name: "Use default horizontal scrollbar in modal container",
    control: {
      type: "boolean",
    },
    defaultValue: false,
  },
  productId: {
    name: "Product id",
  },
  token: {
    name: "Token",
  },
  campaigns: {
    name: "campaigns",
    control: {
      type: "text",
    },
  },
};
