import { Plugin, Compiler, Configuration } from "webpack";

// class MyExampleWebpackPlugin implements Plugin {
//   apply(compiler: Compiler) {
//     // Specify the event hook to attach to
//     compiler.hooks.thisCompilation.tap(
//       "MyExampleWebpackPlugin",
//       (compilation) => {
//         compilation.hooks.buildModule.tap(
//           "MyExampleWebpackPlugin",
//           (module, callback) => {
//             console.log(module._source);

//             return module;
//           }
//         );
//       }
//     );
//   }
// }

class MyExampleWebpackPlugin implements Plugin {
  apply(compiler: Compiler) {
    // Specify the event hook to attach to
    compiler.hooks.compilation.tap("MyExampleWebpackPlugin", (compilation) => {
      compilation.hooks.optimizeAssets.tap(
        "MyExampleWebpackPlugin",
        (module, callback) => {
          console.log(module._source);

          return module;
        }
      );
    });
  }
}

const config = {
  stories: [
    "../../src/components/**/*.stories.@(js|jsx|ts|tsx)",
    "../documentation/**/*.stories.mdx",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@pxtrn/storybook-addon-docs-stencil",
  ],
  features: {
    previewMdx2: true,
    storyStoreV7: true,
  },
  core: {
    builder: {
      name: "webpack5",
    },
    disableTelemetry: true,
  },
  webpackFinal: async (config: Configuration) => {
    config.plugins.push(new MyExampleWebpackPlugin());
    return config;
  },
};

export default config;
