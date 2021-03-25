import { Config } from '@stencil/core';
import dotenvPlugin from 'rollup-plugin-dotenv';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'mediaopt-widgets',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
      dir: 'docs'
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers,
      copy: [
        { src: 'assets' },
        { src: 'favicon.ico' }
      ],
    }
  ],
  plugins: [
    dotenvPlugin(),
    postcss({
      plugins: [autoprefixer()]
    })
  ],
  testing: {
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
