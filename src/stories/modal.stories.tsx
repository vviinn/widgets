export default {
  title: "Components/Modal",
  component: "vviinn-modal",
  decorators: [
    (story: () => any) => `<style>html { background: rgba(0,0,0,0.5) }</style>${story()}`,
  ],
};

const Template = ({ active }) => `<vviinn-modal active=${active}>CONTENT</vviinn-modal>`;

export const Default = Template.bind({});
Default.args = {
  active: true
};
