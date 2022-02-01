import { ViinnVprWidget } from "./vviinn-vpr-widget";

export default {
  title: "Widgets/Recommendation",
  story: "vviinn-vpr-widget",
};

const Template = (args) => ViinnVprWidget(args);

export const Modern = Template.bind({});
Modern.args = {
  mode: "modern",
  showScroll: true
};

export const Classic = Template.bind({});
Classic.args = {
  mode: "classic",
  showScroll: true
};
