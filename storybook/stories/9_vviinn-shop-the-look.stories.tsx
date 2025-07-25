import { vviinnToken } from "../helpers";
import "../documentation/widgets/styles.css";

export default {
  title: "Playground/Shop The Look",
  component: "vviinn-shop-the-look",
  parameters: {
    badges: ["beta", "experimental"],
    docs: {
      description: {
        component: "experimental",
      },
    },
  },
  argTypes: {
    imageUrls: {
      control: { type: "text" },
      description: "Comma-separated list of image URLs",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
    token: {
      control: { type: "text" },
      description: "Authentication token for API requests",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "undefined" },
      },
    },
    width: {
      control: { type: "number", min: 200, max: 800, step: 10 },
      description: "Widget width in pixels",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "350" },
      },
    },
    height: {
      control: { type: "number", min: 200, max: 800, step: 10 },
      description: "Widget height in pixels",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "468" },
      },
    },
  },
};

const Template = (args) => `
  <div style="max-width: 100%; padding: 20px;">
    <vviinn-shop-the-look
      image-urls="${args.imageUrls}"
      token="${args.token}"
      width="${args.width}"
      height="${args.height}"
    ></vviinn-shop-the-look>
  </div>
`;

export const Default = Template.bind({});
Default.storyName = "Shop The Look";

Default.args = {
  token: vviinnToken,
  imageUrls:
    "https://images.unsplash.com/photo-1717076521696-ea6d8ed0963a?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D, https://images.unsplash.com/photo-1613807871118-9e983601b759?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmVydGljYWwlMjBpbWFnZSUyMGludGVyaW9yJTIwcm9vbSUyMGNoYWlyfGVufDB8fDB8fHwy, https://images.unsplash.com/photo-1676786318418-4740318c2246?q=80&w=822&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  width: 350,
  height: 468,
};
