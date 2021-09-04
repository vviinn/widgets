import { extractArgTypes, extractComponentDescription, setStencilDocJson } from '@pxtrn/storybook-addon-docs-stencil';
import docJson from '../docs.json';
if(docJson) setStencilDocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { hideNoControlsWarning: true },
  docs: {
    extractArgTypes,
    extractComponentDescription,
  }
}

export const decorators = [
  (Story) => `<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap'); html, body { font-family: 'Inter', sans-serif; }</style>${Story()}`,
];
