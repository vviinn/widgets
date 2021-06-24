export default {
  title: "Components/Modal",
  decorators: [
    (story) => `<style>html { background: rgba(0,0,0,0.5) }</style>${story()}`,
  ],
};

const Template = () => "<vviinn-modal>CONTENT</vviinn-modal>";

export const Default = Template.bind({});
