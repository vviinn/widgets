const textSearchDecorator = (story) => `
    <div style="
    padding: 20px;
    ">
      ${story()}
    </div>
  `;

export default {
  title: "Components/Text Search",
  component: "vviinn-text-search",
  decorators: [textSearchDecorator],
};

const Template = (args) =>
  `<vviinn-text-search token="${args.token}"
    api-path="${args.apiPath}"
    search-query="${args.searchQuery}"
    mode="${args.mode}"
    locale="${args.locale}"
    show-in-widget="${args.showInWidget}"
  ></vviinn-text-search>
  <vviinn-results token="${args.token}></vviinn-results>`;

export const Default = Template.bind({});

Default.storyName = "Text Search";

Default.args = {
  token: process.env.STORYBOOK_TOKEN,
  apiPath: process.env.STORYBOOK_API_PATH,
  searchQuery: "",
  mode: "textAndImage",
  locale: "en-US",
  showInWidget: false,
};

Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/design/4xUlo6X4l7FHKcHkJRW4C4/Visual-Search-Widget?node-id=1370-226&t=iiWX4CdPIRXmBKQ3-0",
  },
};
