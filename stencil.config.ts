import { Config } from '@stencil/core';
import dotenvPlugin from 'rollup-plugin-dotenv';

export const config: Config = {
  namespace: 'medaopt-vpr',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      copy: [
        { src: 'mocks' },
        { src: 'assets' },
        { src: 'favicon.ico' }
      ],
    }
  ],
  plugins: [
    dotenvPlugin()
  ],
  testing: {
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
