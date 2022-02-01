export default {
  title: "Components/Overlayed Modal",
};
const Template = (args) => `<vviinn-overlayed-modal active="${args.active}">CONTENT</vviinn-overlayed-modal>`;
export const Default = Template.bind({});
Default.args = {
  active: false,
};
