export default {
  title: "Widgets/Visual Search",
  parameters: {
    viewport: {
      defaultViewport: "mobile2"
    }
  }
};

const Template = ({ token, apiPath }) => `
  <vviinn-vps-widget token="${token}"
                     api-path="${apiPath}"
                     active="true">
  </vviinn-vps-widget>`;

export const Default = Template.bind({});
Default.args = {
  token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOjgyLCJqdGkiOiI4ZDU2ZWY4OC1lZWVlLTRiOWQtOTBkYi05OWM3NGNlOGY0ZDYiLCJzY29wZXMiOlsidnByIiwidnBzIiwidnBjIl19.zMVTgD91RMHUYXXhORIZk5sI0R2Jz4Yryz_jlaoBSLo24evOQWslh2QDfJZGEH63gTCpGvnCuaEQP9iA9xnCTDhpcrViricwBngxt6Z9r2NfCpwC-XKBF_kJWhsSnixcJiuTXUpzTYvnLAQ37QfrElkEbG77J7EMgJsuYy4fqAQ",
  apiPath: "https://api.vviinn.com"
};

Default.storyName = "Modal Window";

Default.decorators = [(Story: () => any): string => `
<style>
.sb-show-main.sb-main-padded {
  padding: unset;
}

#root {
  align-content: center;
  display: grid;
  height: 100vh;
  justify-items: center;
}
</style>
${Story()}`];
