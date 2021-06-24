
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  }, 
}

export const decorators = [
  (Story) => `<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap'); html, body { font-family: 'Inter', sans-serif; }</style>${Story()}`,
];
